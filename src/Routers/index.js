import { Route, Routes, BrowserRouter } from "react-router-dom";

import AdminLogin from "../Screens/Auth/Login";
import ForgetPassword from "../Screens/Auth/ForgetPassword";
import ForgetPassword2 from "../Screens/Auth/ForgetPassword2";
import ForgetPassword3 from "../Screens/Auth/ForgetPassword3";
import { Dashboard } from "../Screens/Dashboard";


// import { BookManagement } from "../Screens/BookManagement";
// import { AddBook } from "../Screens/BookManagement/AddBook";
// import { BookDetails } from "../Screens/BookManagement/BookDetail";
// import { EditBook } from "../Screens/BookManagement/EditBook";

import { ProductManagement } from "../Screens/ProductManagement";
import { AddProduct } from "../Screens/ProductManagement/AddProduct";
import { EditProduct } from "../Screens/ProductManagement/EditProduct";
import { ProductDetails } from "../Screens/ProductManagement/ProductDetail";

import { ProductVariation } from "../Screens/ProductVariation";
import { ViewVariation } from "../Screens/ProductVariation/ViewVariation";


// import { MenuManagement } from "../Screens/MenuManagement";
// import { AddMenu } from "../Screens/MenuManagement/AddMenu";
// import { EditMenu } from "../Screens/MenuManagement/EditMenu";

import { CustomiseMenu } from "../Screens/CustomiseMenu";
import { AddMenu } from "../Screens/CustomiseMenu/AddMenu";
import { EditMenu } from "../Screens/CustomiseMenu/EditMenu";
import { CustomerSupport } from "../Screens/CustomerSupport";
import { CurrencyManagement } from "../Screens/CurrencyManagement";
import { ZipCode } from "../Screens/ZipCode";

import { OrderManagement } from "../Screens/OrderManagement";
import { OrderDetails } from "../Screens/OrderManagement/OrderDetail";

// end



import Profile from "../Screens/Profile";
import EditProfile from "../Screens/Profile/EditProfile";
import ChangePassword from "../Screens/Profile/ChangePassword";
import { ProtectedRoutes } from "./ProtectedRoutes";
import Error from "../Screens/Error";


export default function AdminRouter() {
  return (
    <BrowserRouter basename="/FoodStadiumVendor">
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/forget-password2" element={<ForgetPassword2 />} />
        <Route path="/forget-password3" element={<ForgetPassword3 />} />

        <Route path="/dashboard" element={<ProtectedRoutes Components={Dashboard} />} />

        <Route path="/product-management" element={<ProtectedRoutes Components={ProductManagement} />} />
        <Route path="/add-product" element={<ProtectedRoutes Components={AddProduct} />} />
        <Route path="/product-management/product-details/:id" element={<ProtectedRoutes Components={ProductDetails} />} />
        <Route path="/product-management/edit-product/:id" element={<ProtectedRoutes Components={EditProduct} />} />

        <Route path="/product-variation" element={<ProtectedRoutes Components={ProductVariation} />} />
        <Route path="/product-variation/view-details/:id" element={<ProtectedRoutes Components={ViewVariation} />} />

    
        <Route path="/customise-menu" element={<ProtectedRoutes Components={CustomiseMenu} />} />
        <Route path="/add-menu" element={<ProtectedRoutes Components={AddMenu} />} />
        {/* <Route path="/menu-management/menu-details/:id" element={<ProtectedRoutes Components={menuDetails} />} /> */}
        <Route path="/customise-menu/edit-menu/:id" element={<ProtectedRoutes Components={EditMenu} />} />

        <Route path="/zipcode-list" element={<ProtectedRoutes Components={ZipCode} />} />

        <Route path="/order-management" element={<ProtectedRoutes Components={OrderManagement} />} />
        <Route path="/order-management/order-detail/:id" element={<ProtectedRoutes Components={OrderDetails} />} />

        

        <Route path="/customer-support" element={<ProtectedRoutes Components={CustomerSupport} />} />
        <Route path="/currency-management" element={<ProtectedRoutes Components={CurrencyManagement} />} />

        
        <Route path="/profile" element={<ProtectedRoutes Components={Profile} />} />
        <Route path="/profile/edit-profile" element={<ProtectedRoutes Components={EditProfile} />} />
        <Route path="/profile/change-password" element={<ChangePassword />} />

        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}
