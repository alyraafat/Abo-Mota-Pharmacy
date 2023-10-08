import { Route, Routes } from "react-router";
import ManageUsers from "./pages/ManageUsers";
import ViewPharmacists from "./pages/ViewPharmacists";
import ViewPatients from './pages/ViewPatients';
import MedicineScreen from "../pharmacist/scenes/MedicineScreen";
import RegisterForm from "../pharmacist/scenes/RegisterForm";

function AdminApp() {
	return (
		<div>
		<Routes>
			<Route path='/' element={<RegisterForm/>}/>
			<Route path='manageUsers' element={<ManageUsers/>}/>		
			<Route path='viewPatiens' element={<ViewPatients/>}/>			
			<Route path='viewPharmacists' element={<ViewPharmacists/>}/>
			<Route path='medicine' element={<MedicineScreen/>}/>			
		</Routes>
		
		</div>
	)
}

export default AdminApp;