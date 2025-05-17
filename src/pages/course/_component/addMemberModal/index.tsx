import { Modal, Select, Form, message } from "antd";
import { useEffect, useState } from "react";
import { userServices } from "../../../../config/userServices";
import { CourseService } from "../../../../config/courseServices";


export default function AddMemberModal({
  open,
  onClose,
  courseId,
}: {
  open: boolean;
  onClose: () => void;
  courseId: number | null;
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [role, setRole] = useState<"student" | "lecturer" | "admin">("student");

  useEffect(() => {
    if (open && courseId) {
      fetchUsers(courseId);
    }
  }, [open, courseId]);

  const fetchUsers = async (courseId: number) => {
    try {
      const [allUsersRes, courseMembersRes] = await Promise.all([
        userServices.getAllUsers(),
        CourseService.getAllCourseMembers(),
      ]);

      const courseMembers = courseMembersRes.data.filter(
        (m: any) => m.course_id === courseId
      );

      const courseMemberIds = courseMembers.map((m: any) => m.user_id);

      // Lọc ra user chưa phải là thành viên
      const availableUsers = allUsersRes.data.filter(
        (u: any) => !courseMemberIds.includes(u.user_id)
      );

      setUsers(availableUsers);
    } catch (error) {
      message.error("Lỗi khi tải danh sách người dùng.");
    }
  };

  const handleUserChange = (userId: number) => {
    setSelectedUser(userId);
    const user = users.find((u) => u.user_id === userId);
    if (user?.role) {
      setRole(user.role);
    }
  };

  const handleAdd = async () => {
    if (!courseId || !selectedUser) return;

    try {
      await CourseService.addCourseMember({
        course_id: courseId,
        user_id: selectedUser,
        role,
      });
      message.success("Thêm thành viên thành công!");
      onClose();
    } catch (error) {
      message.error("Lỗi khi thêm thành viên.");
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={handleAdd}
      title="Thêm thành viên vào khóa học"
      okText="Thêm"
    >
      <Form layout="vertical">
        <Form.Item label="Người dùng">
          <Select
  showSearch
  placeholder="Chọn người dùng"
  onChange={handleUserChange}
  filterOption={(input, option) =>
    (option?.label as string).toLowerCase().includes(input.toLowerCase())
  }
  options={users.map((u) => ({
    label: `${u.full_name} (${u.email}) - ${u.role}`,
    value: u.user_id,
  }))}
/>

        </Form.Item>
      </Form>
    </Modal>
  );
}
