import React from "react";
import { Routes, Route } from "react-router-dom";
import ProductsGrid from "./MedList";
import RegisterScreen from "./scenes/RegisterScreen";
import NavBar from "../shared/components/NavBar";
import { useGetMedicinesQuery } from "../store";
import MedicineScreen from "./scenes/MedicineScreen";
import Checkout from "./Checkout";
import Order from "./Order";
import OrderCard from "./Order";
import MyOrders from "./myOrders";
import ChangePasswordScreen from "../shared/pages/ChangePasswordScreen";

function PatientApp() {
  const links = [
    { name: "Shop Medicines", to: "/patient/medicine" },
    { name: "View My Orders", to: "/patient/myOrders" },
    {name:"Change password", to:"/patient/changePassword"}
  ];
  // console.log(data);
  return (
    <div>
      <NavBar links={links} />
      <Routes>
        <Route path="medicine" element={<ProductsGrid />} />
        <Route path="medicine2" element={<MedicineScreen />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="/order" element={<OrderCard />} />
        <Route path="/myOrders" element={<MyOrders />} />
        <Route path="/changePassword" element={<ChangePasswordScreen isPatient />}/>
        {/* </Route> */}
      </Routes>
    </div>
  );
}

export default PatientApp;
