import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layouts from "./layouts";
import HomePage from "./pages";
import NotFoundPage from "./pages/NotFoundPage";
import LoginForm from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import AddReadingTest from "./pages/reading/addReadingTest";
import AddReadingPart1 from "./pages/reading/addReadingPart1";
import AddReadingPart2 from "./pages/reading/addReadingPart2";
import AddReadingPart3 from "./pages/reading/addReadingPart3";
import AddReadingPart4 from "./pages/reading/addReadingPart4";
import AddReadingPart5 from "./pages/reading/addReadingPart5";
import AddListeningTest from "./pages/listening/addListeningTest";
import AddListeningItem from "./pages/listening/addListeningItem";
import ListeningView from "./pages/listening/listeningView";
import ReadingView from "./pages/reading/readingView";
import UsersView from "./pages/users";
import CourseView from "./pages/course";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<LoginForm />} />

        <Route
          path="/"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <HomePage />
                </Layouts>
              }
            />
          }
        />

        {/* ✅ Các route cho phần thêm bài Reading */}
        <Route
          path="/reading/add"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <AddReadingTest />
                </Layouts>
              }
            />
          }
        />
        <Route
          path="/reading/add-part-1"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <AddReadingPart1 />
                </Layouts>
              }
            />
          }
        />
        <Route
          path="/reading/add-part-2"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <AddReadingPart2 />
                </Layouts>
              }
            />
          }
        />
        <Route
          path="/reading/add-part-3"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <AddReadingPart3 />
                </Layouts>
              }
            />
          }
        />
        <Route
          path="/reading/add-part-4"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <AddReadingPart4 />
                </Layouts>
              }
            />
          }
        />
        <Route
          path="/reading/add-part-5"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <AddReadingPart5 />
                </Layouts>
              }
            />
          }
        />
        <Route
          path="/reading/view"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <ReadingView />
                </Layouts>
              }
            />
          }
        />

        <Route
          path="/listening/add"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <AddListeningTest />
                </Layouts>
              }
            />
          }
        />
        <Route
          path="/listening/add-item"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <AddListeningItem />
                </Layouts>
              }
            />
          }
        />
        <Route
          path="/listening/view"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <ListeningView />
                </Layouts>
              }
            />
          }
        />

        <Route
          path="/users/view"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <UsersView />
                </Layouts>
              }
            />
          }
        />
        <Route
          path="/course/view"
          element={
            <PrivateRoute
              element={
                <Layouts>
                  <CourseView />
                </Layouts>
              }
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
