import { Modal, Input, Button } from "antd";
import { useState } from "react";

export default function CreateCourseModal({ open, onClose, onCreate }: any) {
  const [course, setCourse] = useState({ course_name: "", description: "" });

  const handleCreate = () => {
    onCreate(course);
    setCourse({ course_name: "", description: "" });
  };

  return (
    <Modal open={open} onCancel={onClose} footer={null} title="Tạo khóa học mới">
      <Input
        placeholder="Tên khóa học"
        value={course.course_name}
        onChange={(e) => setCourse({ ...course, course_name: e.target.value })}
        className="mb-3"
      />
      <Input.TextArea
        placeholder="Mô tả"
        rows={4}
        value={course.description}
        onChange={(e) => setCourse({ ...course, description: e.target.value })}
        className="mb-3"
      />
      <Button type="primary" block onClick={handleCreate}>
        Tạo khóa học
      </Button>
    </Modal>
  );
}