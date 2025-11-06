import hashlib
import hmac
import urllib.parse
from datetime import datetime
import requests
import os

class VNPayPaymentService:
    def __init__(self):
        self.vnp_tmncode = os.getenv('VNPAY_TMN_CODE', 'VNPAY_TEST')
        self.vnp_hashsecret = os.getenv('VNPAY_HASH_SECRET', 'VNPAY_TEST_SECRET')
        self.vnp_url = os.getenv('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html')
        self.vnp_return_url = os.getenv('VNPAY_RETURN_URL', 'http://localhost:3000/payment/vnpay/return')
        self.vnp_api_url = os.getenv('VNPAY_API_URL', 'https://sandbox.vnpayment.vn/merchant_webapi/api/transaction')

    def create_payment_request(self, booking_id: int, amount: int, order_info: str, ip_addr: str = "127.0.0.1"):
        """Tạo yêu cầu thanh toán VNPay"""
        try:
            # Tạo order_id unique
            order_id = f"BOOKING_{booking_id}_{int(datetime.now().timestamp())}"
            
            # Tạo request_id unique
            request_id = f"REQ_{booking_id}_{int(datetime.now().timestamp())}"
            
            # Tạo thời gian
            vnp_create_date = datetime.now().strftime('%Y%m%d%H%M%S')
            vnp_expire_date = datetime.now().replace(hour=23, minute=59, second=59).strftime('%Y%m%d%H%M%S')
            
            # Tạo parameters
            vnp_params = {
                'vnp_Version': '2.1.0',
                'vnp_Command': 'pay',
                'vnp_TmnCode': self.vnp_tmncode,
                'vnp_Amount': str(amount * 100),  # VNPay yêu cầu amount * 100
                'vnp_CurrCode': 'VND',
                'vnp_TxnRef': order_id,
                'vnp_OrderInfo': order_info,
                'vnp_OrderType': 'other',
                'vnp_Locale': 'vn',
                'vnp_ReturnUrl': self.vnp_return_url,
                'vnp_IpAddr': ip_addr,
                'vnp_CreateDate': vnp_create_date,
                'vnp_ExpireDate': vnp_expire_date
            }
            
            # Sắp xếp parameters theo thứ tự alphabet
            sorted_params = sorted(vnp_params.items())
            
            # Tạo query string
            query_string = '&'.join([f"{key}={urllib.parse.quote_plus(str(value))}" for key, value in sorted_params])
            
            # Tạo secure hash
            hash_data = query_string
            secure_hash = hmac.new(
                self.vnp_hashsecret.encode('utf-8'),
                hash_data.encode('utf-8'),
                hashlib.sha512
            ).hexdigest()
            
            # Thêm secure hash vào URL
            payment_url = f"{self.vnp_url}?{query_string}&vnp_SecureHash={secure_hash}"
            
            return {
                "success": True,
                "payment_url": payment_url,
                "order_id": order_id,
                "request_id": request_id,
                "vnp_params": vnp_params
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Lỗi tạo thanh toán VNPay: {str(e)}"
            }

    def verify_payment(self, vnp_params: dict):
        """Xác thực kết quả thanh toán từ VNPay"""
        try:
            # Lấy secure hash từ params
            vnp_secure_hash = vnp_params.pop('vnp_SecureHash', '')
            
            # Sắp xếp parameters
            sorted_params = sorted(vnp_params.items())
            
            # Tạo query string để verify
            query_string = '&'.join([f"{key}={urllib.parse.quote_plus(str(value))}" for key, value in sorted_params])
            
            # Tạo secure hash để so sánh
            hash_data = query_string
            calculated_hash = hmac.new(
                self.vnp_hashsecret.encode('utf-8'),
                hash_data.encode('utf-8'),
                hashlib.sha512
            ).hexdigest()
            
            # Kiểm tra hash
            if calculated_hash.lower() != vnp_secure_hash.lower():
                return {
                    "success": False,
                    "error": "Invalid signature"
                }
            
            # Kiểm tra response code
            response_code = vnp_params.get('vnp_ResponseCode', '')
            transaction_status = vnp_params.get('vnp_TransactionStatus', '')
            
            if response_code == '00' and transaction_status == '00':
                return {
                    "success": True,
                    "order_id": vnp_params.get('vnp_TxnRef', ''),
                    "transaction_id": vnp_params.get('vnp_TransactionNo', ''),
                    "amount": int(vnp_params.get('vnp_Amount', '0')) // 100,
                    "bank_code": vnp_params.get('vnp_BankCode', ''),
                    "card_type": vnp_params.get('vnp_CardType', ''),
                    "pay_date": vnp_params.get('vnp_PayDate', ''),
                    "response_code": response_code,
                    "transaction_status": transaction_status
                }
            else:
                return {
                    "success": False,
                    "error": f"Payment failed with code: {response_code}",
                    "response_code": response_code,
                    "transaction_status": transaction_status
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Lỗi xác thực thanh toán: {str(e)}"
            }

    def query_transaction(self, order_id: str, transaction_date: str):
        """Truy vấn thông tin giao dịch"""
        try:
            vnp_params = {
                'vnp_Version': '2.1.0',
                'vnp_Command': 'querydr',
                'vnp_TmnCode': self.vnp_tmncode,
                'vnp_TxnRef': order_id,
                'vnp_OrderInfo': f'Query transaction {order_id}',
                'vnp_TransactionDate': transaction_date,
                'vnp_CreateDate': datetime.now().strftime('%Y%m%d%H%M%S'),
                'vnp_IpAddr': '127.0.0.1'
            }
            
            # Sắp xếp parameters
            sorted_params = sorted(vnp_params.items())
            
            # Tạo query string
            query_string = '&'.join([f"{key}={value}" for key, value in sorted_params])
            
            # Tạo secure hash
            secure_hash = hmac.new(
                self.vnp_hashsecret.encode('utf-8'),
                query_string.encode('utf-8'),
                hashlib.sha512
            ).hexdigest()
            
            vnp_params['vnp_SecureHash'] = secure_hash
            
            # Gửi request
            response = requests.post(self.vnp_api_url, data=vnp_params, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "success": True,
                    "data": result
                }
            else:
                return {
                    "success": False,
                    "error": f"API call failed with status: {response.status_code}"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Lỗi truy vấn giao dịch: {str(e)}"
            }