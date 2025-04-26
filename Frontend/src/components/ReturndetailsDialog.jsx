import { Avatar, Badge } from "@material-tailwind/react";

const ReturnDetailsDialog = ({ returnItem, isOpen, onClose }) => {
  if (!isOpen || !returnItem) return null;
  
  const getStatusBadge = (status) => {
    switch(status) {
      case "completed":
        return <Badge color="green" content="คืนแล้ว" className="border-0" />;
      case "overdue":
        return <Badge color="red" content="เกินกำหนด" className="border-0" />;
      case "pending":
        return <Badge color="amber" content="รอคืน" className="border-0" />;
      default:
        return <Badge color="gray" content={status} className="border-0" />;
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-xl text-center">รายละเอียดการคืน</h3>
        
        <div className="divider">ข้อมูลครุภัณฑ์</div>
        
        <div className="flex gap-4">
          <Avatar 
            src={returnItem.equipment.image} 
            alt={returnItem.equipment.name} 
            size="lg" 
            variant="square" 
            className="shadow-md"
          />
          <div>
            <p className="font-bold text-lg">{returnItem.equipment.name}</p>
            <p className="text-gray-600">รหัส: {returnItem.equipment.code}</p>
            <p className="text-gray-600">รหัสการยืม: {returnItem.borrow_code}</p>
            <p className="text-gray-600">รหัสการคืน: {returnItem.return_code}</p>
          </div>
        </div>
        
        <div className="divider">ข้อมูลผู้ยืม</div>
        
        <div className="flex items-center gap-4">
          <Avatar 
            src={returnItem.borrower.avatar} 
            alt={returnItem.borrower.name} 
            size="lg" 
          />
          <div>
            <p className="font-semibold">{returnItem.borrower.name}</p>
            <p className="text-gray-600">{returnItem.borrower.department}</p>
          </div>
        </div>
        
        <div className="divider">ข้อมูลการยืม-คืน</div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500">วันที่ยืม</p>
            <p className="font-medium">{returnItem.borrow_date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">กำหนดคืน</p>
            <p className="font-medium">{returnItem.due_date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">วันที่คืนจริง</p>
            <p className="font-medium">{returnItem.return_date || '-'}</p>
          </div>
        </div>
        
        <div className="divider">สถานะการคืน</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500">สถานะ</p>
            <div className="mt-1">
              {getStatusBadge(returnItem.status)}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500">สภาพที่คืน</p>
            <p className="font-medium">{returnItem.condition || '-'}</p>
          </div>
        </div>
        
        {returnItem.fine_amount > 0 && (
          <>
            <div className="divider">ค่าปรับ</div>
            <div className="alert alert-warning">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className="font-bold">มีการเรียกเก็บค่าปรับ</h3>
                <div className="text-xs">จำนวน {returnItem.fine_amount} บาท</div>
              </div>
            </div>
          </>
        )}
        
        {returnItem.notes && (
          <>
            <div className="divider">หมายเหตุ</div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{returnItem.notes}</p>
            </div>
          </>
        )}
        
        <div className="modal-action">
          <button 
            className="btn btn-outline" 
            onClick={onClose}
          >
            ปิด
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default ReturnDetailsDialog;