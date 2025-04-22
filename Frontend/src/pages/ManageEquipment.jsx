import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Input,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  Avatar,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";

const TABLE_HEAD = [
  "รหัสครุภัณฑ์",
  "ชื่อครุภัณฑ์",
  "รูปภาพ",
  "รายละเอียด",
  "จำนวน",
  "สถานะ",
  "วันที่เพิ่ม",
  ""
];

const TABLE_ROWS = [
  {
    id: "EQ-001",
    name: "กล้อง Sony",
    description: "กล้อง 1000 px",
    quantity: "10 ชิ้น",
    status: "พร้อมใช้งาน",
    created_at: "2023-10-01 10:00:00",
    pic: "https://cdn-icons-png.flaticon.com/512/2922/2922506.png"
  },
  {
    id: "EQ-002",
    name: "ไมโครโฟน",
    description: "ไมโครโฟนเสียงคมชัด",
    quantity: "5 ชิ้น",
    status: "อยู่ระหว่างซ่อม",
    created_at: "2023-09-25 14:30:00",
    pic: "https://cdn-icons-png.flaticon.com/512/3652/3652191.png"
  },
  {
    id: "EQ-003",
    name: "ลำโพง Bluetooth",
    description: "ลำโพงกำลังสูง 50W",
    quantity: "8 ชิ้น",
    status: "ชำรุด",
    created_at: "2023-09-20 09:15:00",
    pic: "https://cdn-icons-png.flaticon.com/512/3652/3652283.png"
  },
  {
    id: "EQ-004",
    name: "โปรเจคเตอร์",
    description: "ความละเอียด 4K",
    quantity: "3 ชิ้น",
    status: "ถูกยืม",
    created_at: "2023-09-15 13:45:00",
    pic: "https://cdn-icons-png.flaticon.com/512/2777/2777154.png"
  },
];

const statusColors = {
  "พร้อมใช้งาน": "green",
  "อยู่ระหว่างซ่อม": "amber",
  "ชำรุด": "red",
  "ถูกยืม": "blue"
};

function ManageEquipment() {
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              รายการครุภัณฑ์
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              จัดการข้อมูลครุภัณฑ์ทั้งหมด
            </Typography>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600" size="sm">
            + เพิ่มครุภัณฑ์
          </Button>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-72">
            <Input
              label="ค้นหาครุภัณฑ์"
              icon={<MagnifyingGlassIcon className="h-5 w-5" />}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outlined" size="sm">ส่งออก Excel</Button>
            <Button variant="outlined" size="sm">ตัวกรอง</Button>
          </div>
        </div>
      </CardHeader>
      <CardBody className="overflow-scroll px-0">
        <table className="mt-4 w-full min-w-max table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                >
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal leading-none opacity-70"
                  >
                    {head}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(({ id, name, description, quantity, status, created_at, pic }, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <tr key={id}>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-bold">
                      {id}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-semibold">
                      {name}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Avatar 
                      src={pic} 
                      alt={name} 
                      size="lg" 
                      className="border border-blue-gray-50 shadow-sm"
                      withBorder={true}
                    />
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {description}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-medium">
                      {quantity}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Chip
                      variant="filled"
                      size="sm"
                      value={status}
                      color={statusColors[status] || "gray"}
                      className="rounded-full py-1.5 px-3 font-medium"
                    />
                  </td>
                  <td className={classes}>
                    <Typography variant="small" color="blue-gray" className="font-normal">
                      {created_at}
                    </Typography>
                  </td>
                  <td className={classes}>
                    <Tooltip content="แก้ไข">
                      <IconButton variant="text" color="blue-gray">
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
        <Typography variant="small" color="blue-gray" className="font-normal">
          Showing 1 to {TABLE_ROWS.length} of {TABLE_ROWS.length} entries
        </Typography>
        <div className="flex gap-2">
          <Button variant="outlined" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outlined" size="sm" disabled>
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ManageEquipment;