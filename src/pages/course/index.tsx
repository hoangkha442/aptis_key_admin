import { useEffect, useState } from "react";
import { Button } from "antd";
import { CourseService } from "../../config/courseServices";
import { userServices } from "../../config/userServices";
import CourseTable from "./_component/courseTable";
import CreateCourseModal from "./_component/createCourseModal";
import MemberListModal from "./_component/memberListModal";
import AddMemberModal from "./_component/addMemberModal";
import EditCourseModal from "./_component/editCourseModal";
type CourseMember = {
  course_member_id: number;
  course_id: number;
  user_id: number;
  role: string;
  full_name: string;
  email: string;
  status?: string;
};
export default function CourseView() {
  const [courses, setCourses] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [members, setMembers] = useState<CourseMember[]>([]);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [addingCourseId, setAddingCourseId] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
const [editingCourse, setEditingCourse] = useState<any>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await CourseService.getAllCourses();
    setCourses(res.data);
  };

  const handleCreateCourse = async (course: any) => {
    await CourseService.createCourse(course);
    fetchCourses();
    setIsCreateModalOpen(false);
  };

  const handleDeleteCourse = async (id: number) => {
    await CourseService.deleteCourse(id);
    fetchCourses();
  };
const handleEditCourse = (course: any) => {
  setEditingCourse(course);
  setIsEditModalOpen(true);
};

  const handleOpenAddMember = (id: number) => {
    setAddingCourseId(id);
    setIsAddMemberModalOpen(true);
  };
  const handleViewMembers = async (course_id: number) => {
    const res = await CourseService.getAllCourseMembers();
    const filtered = res.data.filter((m: any) => m.course_id === course_id);

    // Gọi thêm user info
    const detailedMembers = await Promise.all(
      filtered.map(async (m: any) => {
        const userRes = await userServices.getUserById(m.user_id);
        return {
          ...m,
          ...userRes.data, 
        };
      })
    );

    setMembers(detailedMembers);
    setSelectedCourseId(course_id);
    setMemberModalOpen(true);
  };
  const handleUpdateCourse = async (updated: { course_name: string; description: string }) => {
  if (!editingCourse) return;
  await CourseService.updateCourse(editingCourse.course_id, updated);
  fetchCourses();
  setIsEditModalOpen(false);
};


  const handleRemoveMember = async (id: number) => {
    await CourseService.deleteCourseMember(id);
    handleViewMembers(selectedCourseId!);
  };

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4">
        <Button type="primary" onClick={() => setIsCreateModalOpen(true)}>
          Thêm khóa học
        </Button>
      </div>
      <CourseTable
  courses={courses}
  onDelete={handleDeleteCourse}
  onAddMember={handleOpenAddMember}
  onViewMembers={handleViewMembers}
  onEdit={handleEditCourse}
/>


      <CreateCourseModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateCourse}
      />
      <AddMemberModal
        open={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        courseId={addingCourseId}
      />
<EditCourseModal
  open={isEditModalOpen}
  onClose={() => setIsEditModalOpen(false)}
  initialValues={editingCourse}
  onUpdate={handleUpdateCourse}
/>

      <MemberListModal
        open={memberModalOpen}
        onClose={() => setMemberModalOpen(false)}
        members={members}
        onRemove={handleRemoveMember}
      />
    </div>
  );
}
