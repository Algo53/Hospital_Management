import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import { selectRole } from './redux/slices/UserInfoSlice';
import { useAppSelector } from './redux/store';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/adminPages/AdminDashboard';
import DoctorDashboard from './pages/doctorPages/DoctorDashboard';
import NurseDashboard from './pages/nursePages/NurseDashboard';
import PatientDashboard from './pages/patientPages/PatientDashboard';
import NormalLayout from './Layouts/NormalLayout';
import UserLayout from './Layouts/UserLayout';
import ProfilePage from './pages/ProfilePage';
import DoctorsList from './pages/DoctorsList';
import AddDoctor from './pages/adminPages/AddDoctor';
import AddNurse from './pages/adminPages/AddNurse';
import NurseList from './pages/NurseList';
import AddPatient from './pages/nursePages/AddPatient';
import CreateAppointment from './pages/nursePages/CreateAppointment';
import PatientList from './pages/PatientList';

function App() {
  const userRole = useAppSelector(selectRole);

  const userLayout = (role: string | null) => {
    switch (role) {
      case 'Admin':
        return { dashboard: <AdminDashboard /> };
      case 'Doctor':
        return { dashboard: <DoctorDashboard /> };
      case 'Nurse':
        return { dashboard: <NurseDashboard /> };
      case 'Patient':
        return { dashboard: <PatientDashboard /> };
      default:
        return { dashboard: <HomePage /> };
    }
  }

  const {dashboard } = userLayout(userRole);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <NormalLayout />,
      children: [
        {
          path: '/',
          element: <HomePage />,
        },
        {
          path: '/login',
          element: <LoginPage />,
        },
        {
          path: '/signup',
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: '/:id',
      element: <UserLayout />,
      children: [
        {
          path: '',
          element: dashboard,
        },
        {
          path: 'profile',
          element: <ProfilePage />,
        },
        {
          path: 'doctors',
          element: <DoctorsList />
        },
        {
          path: 'doctor/add',
          element: <AddDoctor />  
        },
        {
          path: 'nurse/add',
          element: <AddNurse />  
        },
        {
          path: 'staff',
          element: <NurseList />  
        },
        {
          path: 'patient/add',
          element: <AddPatient />
        },
        {
          path: 'patients',
          element: <PatientList />  
        },
        {
          path: 'appointment/add',
          element: <CreateAppointment />
        }
      ]
    }
  ])
  return (
    <RouterProvider router={router} />
  );
}

export default App;
