import hashlib
import hmac
import json
import requests
from typing import Dict, Any
from app.config import settings

class MoMoPaymentService:
    def __init__(self):
        self.partner_code = getattr(settings, 'MOMO_PARTNER_CODE', 'MOMO')
        self.access_key = getattr(settings, 'MOMO_ACCESS_KEY', '')
        self.secret_key = getattr(settings, 'MOMO_SECRET_KEY', '')
        self.endpoint = getattr(settings, 'MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create')
        self.redirect_url = getattr(settings, 'MOMO_REDIRECT_URL', 'http://localhost:3000/payment/success')
        self.notify_url = getattr(settings, 'MOMO_NOTIFY_URL', 'http://localhost:8000/api/payments/momo/callback')

    def create_payment_request(self, booking_id: int, amount: int, order_info: str) -> Dict[str, Any]:
        """Tạo yêu cầu thanh toán MOMO"""
        
        order_id = f"BOOKING_{booking_id}_{int(__import__('time').time())}"
        request_id = order_id
        
        # Tạo raw signature
        raw_signature = f"accessKey={self.access_key}&amount={amount}&extraData=&ipnUrl={self.notify_url}&orderId={order_id}&orderInfo={order_info}&partnerCode={self.partner_code}&redirectUrl={self.redirect_url}&requestId={request_id}&requestType=captureWallet"
        
        # Tạo signature
        signature = hmac.new(
            self.secret_key.encode('utf-8'),
            raw_signature.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        # Dữ liệu gửi đến MOMO
        data = {
            "partnerCode": self.partner_code,
            "accessKey": self.access_key,
            "requestId": request_id,
            "amount": str(amount),
            "orderId": order_id,
            "orderInfo": order_info,
            "redirectUrl": self.redirect_url,
            "ipnUrl": self.notify_url,
            "extraData": "",
            "requestType": "captureWallet",
            "signature": signature,
            "lang": "vi"
        }
        
        try:
            response = requests.post(self.endpoint, json=data, timeout=30)
            result = response.json()
            
            if result.get('resultCode') == 0:
                return {
                    "success": True,
                    "payment_url": result.get('payUrl'),
                    "order_id": order_id,
                    "request_id": request_id,
                    "qr_code_url": result.get('qrCodeUrl'),
                    "deep_link": result.get('deeplink')
                }
            else:
                return {
                    "success": False,
                    "error": result.get('message', 'Lỗi tạo thanh toán MOMO'),
                    "result_code": result.get('resultCode')
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Lỗi kết nối MOMO: {str(e)}"
            }

    def verify_payment(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Xác thực callback từ MOMO"""
        
        # Lấy signature từ MOMO
        received_signature = data.get('signature', '')
        
        # Tạo lại signature để verify
        raw_signature = f"accessKey={data.get('accessKey', '')}&amount={data.get('amount', '')}&extraData={data.get('extraData', '')}&message={data.get('message', '')}&orderId={data.get('orderId', '')}&orderInfo={data.get('orderInfo', '')}&orderType={data.get('orderType', '')}&partnerCode={data.get('partnerCode', '')}&payType={data.get('payType', '')}&requestId={data.get('requestId', '')}&responseTime={data.get('responseTime', '')}&resultCode={data.get('resultCode', '')}&transId={data.get('transId', '')}"
        
        expected_signature = hmac.new(
            self.secret_key.encode('utf-8'),
            raw_signature.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        # Kiểm tra signature
        if received_signature != expected_signature:
            return {
                "success": False,
                "error": "Invalid signature"
            }
        
        # Kiểm tra kết quả thanh toán
        result_code = data.get('resultCode')
        if result_code == 0:
            return {
                "success": True,
                "order_id": data.get('orderId'),
                "transaction_id": data.get('transId'),
                "amount": int(data.get('amount', 0)),
                "message": data.get('message', '')
            }
        else:
            return {
                "success": False,
                "error": data.get('message', 'Thanh toán thất bại'),
                "result_code": result_code
            }