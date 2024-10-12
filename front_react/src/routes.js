import React from "react";
import { BrowserRouter, Route, Routes as Switch } from "react-router-dom";

import UserLayout from "./layouts/UserLayout";
import NotFound from "./pages/NotFound";
import { PdfContextProvider } from "./contexts/PdfContext";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import PersistLogin from "./components/PersistLogin";
import { AuthProvider } from "./contexts/AuthProvider";
import RequiredAuth from "./layouts/RequiredAuth";
import NewEditDocument from "./pages/NewEditDocument";
import NewEditContract from "./pages/NewEditContract";
export default function Routes() {
    return (
        <AuthProvider>
            <PdfContextProvider>
                <BrowserRouter>
                    <Switch>
                        <Route path="/user/login" element={<Login />} />
                        <Route element={<PersistLogin />}>
                            <Route element={<RequiredAuth />}>
                                <Route path="/user/*" element={
                                                <UserLayout />
                                }>
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="documents/new" element={<NewEditDocument />} />
                                    <Route path="contracts/new" element={<NewEditContract />} />
                                    {/* <Route path="products/new" element={<NewEditProduct />} />
                                    <Route path="productslist" element={<ProductList />} />
                                    <Route path="orderslist" element={<OrdersList />} />
                                    <Route path="orders/:order_id" element={<Order />} />
                                    <Route path="orders/new" element={<NewEditOrder />} />
                                    <Route path="categorieslist" element={<CategoriesList />} />
                                    <Route path="categories/new" element={<NewEditCategory />} /> */}
                                </Route>
                            </Route>
                        </Route>
                        <Route path="*" element={<NotFound />} />

                    </Switch>
                </BrowserRouter>
            </PdfContextProvider>
        </AuthProvider>
    );
}