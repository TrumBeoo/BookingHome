from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any
from app.db import get_db
from app.auth import get_current_user
from app.models import Booking, Payment, User
from app.services.momo_payment import MoMoPaymentService
from app.services.vnpay_payment import VNPayPaymentService

router = APIRouter(prefix="/payments", tags=["payments"])

class MoMoPaymentRequest(BaseModel):
    booking_id: int

class VNPayPaymentRequest(BaseModel):
    booking_id: int

class MoMoCallbackData(BaseModel):
    partnerCode: str
    orderId: str
    requestId: str
    amount: str
    orderInfo: str
    orderType: str
    transId: str
    resultCode: int
    message: str
    payType: str
    responseTime: str
    extraData: str
    signature: str

@router.post("/momo/create")
async def create_momo_payment(
    payment_request: MoMoPaymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Tạo thanh toán MOMO cho booking"""
    
    # Kiểm tra booking tồn tại và thuộc về user
    booking = db.query(Booking).filter(
        Booking.id == payment_request.booking_id,
        Booking.user_id == current_user.id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking không tồn tại")
    
    if booking.status != 'pending':
        raise HTTPException(status_code=400, detail="Booking đã được xử lý")
    
    # Tạo payment record
    payment = Payment(
        booking_id=booking.id,
        payment_method='momo',
        amount=booking.total_price,
        status='pending'
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    # Tạo MOMO payment request
    momo_service = MoMoPaymentService()
    amount_vnd = int(float(booking.total_price))
    order_info = f"Thanh toán đặt phòng {booking.homestay.name}"
    
    result = momo_service.create_payment_request(
        booking_id=booking.id,
        amount=amount_vnd,
        order_info=order_info
    )
    
    if result["success"]:
        # Cập nhật payment với thông tin MOMO
        payment.transaction_id = result["order_id"]
        payment.payment_details = {
            "order_id": result["order_id"],
            "request_id": result["request_id"]
        }
        db.commit()
        
        return {
            "success": True,
            "payment_url": result["payment_url"],
            "qr_code_url": result.get("qr_code_url"),
            "deep_link": result.get("deep_link"),
            "payment_id": payment.id
        }
    else:
        # Xóa payment record nếu tạo MOMO payment thất bại
        db.delete(payment)
        db.commit()
        
        raise HTTPException(
            status_code=400,
            detail=result["error"]
        )

@router.post("/momo/callback")
async def momo_payment_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """Xử lý callback từ MOMO"""
    
    try:
        # Lấy dữ liệu từ request
        data = await request.json()
        
        # Verify payment với MOMO
        momo_service = MoMoPaymentService()
        verification_result = momo_service.verify_payment(data)
        
        if not verification_result["success"]:
            return {"RspCode": "97", "Message": "Invalid signature"}
        
        # Tìm payment record
        order_id = verification_result["order_id"]
        booking_id = int(order_id.split("_")[1])
        
        payment = db.query(Payment).filter(
            Payment.booking_id == booking_id,
            Payment.payment_method == 'momo'
        ).first()
        
        if not payment:
            return {"RspCode": "01", "Message": "Payment not found"}
        
        # Cập nhật trạng thái payment
        if verification_result["success"]:
            payment.status = 'paid'
            payment.transaction_id = verification_result["transaction_id"]
            payment.paid_at = __import__('datetime').datetime.now()
            
            # Cập nhật trạng thái booking
            booking = db.query(Booking).filter(Booking.id == booking_id).first()
            if booking:
                booking.status = 'confirmed'
        else:
            payment.status = 'failed'
        
        current_details = payment.payment_details or {}
        payment.payment_details = {
            **current_details,
            "callback_data": data,
            "verification_result": verification_result
        }
        
        db.commit()
        
        return {"RspCode": "00", "Message": "Success"}
        
    except Exception as e:
        return {"RspCode": "99", "Message": f"System error: {str(e)}"}

@router.get("/momo/status/{payment_id}")
async def check_momo_payment_status(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kiểm tra trạng thái thanh toán MOMO"""
    
    # Tìm payment
    payment = db.query(Payment).join(Booking).filter(
        Payment.id == payment_id,
        Booking.user_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment không tồn tại")
    
    return {
        "payment_id": payment.id,
        "status": payment.status,
        "amount": float(payment.amount),
        "transaction_id": payment.transaction_id,
        "paid_at": payment.paid_at.isoformat() if payment.paid_at else None,
        "booking_status": payment.booking.status
    }

@router.post("/vnpay/create")
async def create_vnpay_payment(
    payment_request: VNPayPaymentRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Tạo thanh toán VNPay cho booking"""
    
    # Kiểm tra booking tồn tại và thuộc về user
    booking = db.query(Booking).filter(
        Booking.id == payment_request.booking_id,
        Booking.user_id == current_user.id
    ).first()
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking không tồn tại")
    
    if booking.status != 'pending':
        raise HTTPException(status_code=400, detail="Booking đã được xử lý")
    
    # Tạo payment record
    payment = Payment(
        booking_id=booking.id,
        payment_method='vnpay',
        amount=booking.total_price,
        status='pending'
    )
    db.add(payment)
    db.commit()
    db.refresh(payment)
    
    # Tạo VNPay payment request
    vnpay_service = VNPayPaymentService()
    amount_vnd = int(float(booking.total_price))
    order_info = f"Thanh toan dat phong {booking.homestay.name}"
    
    # Lấy IP address từ request
    client_ip = request.client.host
    
    result = vnpay_service.create_payment_request(
        booking_id=booking.id,
        amount=amount_vnd,
        order_info=order_info,
        ip_addr=client_ip
    )
    
    if result["success"]:
        # Cập nhật payment với thông tin VNPay
        payment.transaction_id = result["order_id"]
        payment.payment_details = {
            "order_id": result["order_id"],
            "request_id": result["request_id"],
            "vnp_params": result["vnp_params"]
        }
        db.commit()
        
        return {
            "success": True,
            "payment_url": result["payment_url"],
            "payment_id": payment.id
        }
    else:
        # Xóa payment record nếu tạo VNPay payment thất bại
        db.delete(payment)
        db.commit()
        
        raise HTTPException(
            status_code=400,
            detail=result["error"]
        )

@router.post("/vnpay/callback")
async def vnpay_payment_callback(
    request: Request,
    db: Session = Depends(get_db)
):
    """Xử lý callback từ VNPay"""
    
    try:
        # Lấy dữ liệu từ query parameters
        vnp_params = dict(request.query_params)
        
        # Verify payment với VNPay
        vnpay_service = VNPayPaymentService()
        verification_result = vnpay_service.verify_payment(vnp_params.copy())
        
        if not verification_result["success"]:
            return {"RspCode": "97", "Message": "Invalid signature"}
        
        # Tìm payment record
        order_id = verification_result["order_id"]
        booking_id = int(order_id.split("_")[1])
        
        payment = db.query(Payment).filter(
            Payment.booking_id == booking_id,
            Payment.payment_method == 'vnpay'
        ).first()
        
        if not payment:
            return {"RspCode": "01", "Message": "Payment not found"}
        
        # Cập nhật trạng thái payment
        if verification_result["success"]:
            payment.status = 'paid'
            payment.transaction_id = verification_result["transaction_id"]
            payment.paid_at = __import__('datetime').datetime.now()
            
            # Cập nhật trạng thái booking
            booking = db.query(Booking).filter(Booking.id == booking_id).first()
            if booking:
                booking.status = 'confirmed'
        else:
            payment.status = 'failed'
        
        current_details = payment.payment_details or {}
        payment.payment_details = {
            **current_details,
            "callback_data": vnp_params,
            "verification_result": verification_result
        }
        
        db.commit()
        
        return {"RspCode": "00", "Message": "Success"}
        
    except Exception as e:
        return {"RspCode": "99", "Message": f"System error: {str(e)}"}

@router.get("/vnpay/status/{payment_id}")
async def check_vnpay_payment_status(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Kiểm tra trạng thái thanh toán VNPay"""
    
    # Tìm payment
    payment = db.query(Payment).join(Booking).filter(
        Payment.id == payment_id,
        Booking.user_id == current_user.id
    ).first()
    
    if not payment:
        raise HTTPException(status_code=404, detail="Payment không tồn tại")
    
    return {
        "payment_id": payment.id,
        "status": payment.status,
        "amount": float(payment.amount),
        "transaction_id": payment.transaction_id,
        "paid_at": payment.paid_at.isoformat() if payment.paid_at else None,
        "booking_status": payment.booking.status
    }

@router.get("/methods")
async def get_payment_methods():
    """Lấy danh sách phương thức thanh toán"""
    
    return {
        "methods": [
            {
                "id": "momo",
                "name": "Ví MoMo",
                "description": "Thanh toán qua ví điện tử MoMo",
                "icon": "momo",
                "enabled": True
            },
            {
                "id": "vnpay",
                "name": "VNPay",
                "description": "Thanh toán qua cổng VNPay",
                "icon": "vnpay",
                "enabled": True
            },
            {
                "id": "bank_transfer",
                "name": "Chuyển khoản ngân hàng",
                "description": "Chuyển khoản trực tiếp qua ngân hàng",
                "icon": "bank",
                "enabled": True
            },
            {
                "id": "cash",
                "name": "Tiền mặt",
                "description": "Thanh toán bằng tiền mặt khi nhận phòng",
                "icon": "cash",
                "enabled": True
            }
        ]
    }