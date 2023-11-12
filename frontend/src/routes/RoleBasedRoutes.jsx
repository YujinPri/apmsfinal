import { useLocation, Navigate, Routes, Route } from "react-router-dom";
import useAuth from "../hooks/useAuth";

import Feed from "../components/Feed";
import Explore from "../components/Explore";
import Announcements from "../components/Announcements";
import News from "../components/News";
import Events from "../components/Events";
import UpdateProfile from "../components/profile_edit/UpdateProfile";
import Fundraise from "../components/Fundraise";
import Missing from "../components/Missing";
import PublicLayout from "../layout/PublicLayout";
import MainLayout from "../layout/MainLayout";

   const RoleBasedRoutes = ({ mode, setMode }) => {
     const { auth } = useAuth();
     const location = useLocation();

     if (auth?.role === "public") {
       return (
         <Routes>
           <Route path="home" element={<PublicLayout />} />
           <Route path="*" element={<Missing />} />
         </Routes>
       );
     }
     if (auth?.role === "alumni") {
       return (
         <Routes>
           <Route
             path="home"
             element={
               <MainLayout mode={mode} setMode={setMode} activeIndex={1}>
                 <Feed />
               </MainLayout>
             }
           />
           <Route
             path="explore"
             element={
               <MainLayout mode={mode} setMode={setMode} activeIndex={2}>
                 <Explore />
               </MainLayout>
             }
           />
           <Route
             path="announcements"
             element={
               <MainLayout mode={mode} setMode={setMode} activeIndex={3}>
                 <Announcements />
               </MainLayout>
             }
           />
           <Route
             path="news"
             element={
               <MainLayout mode={mode} setMode={setMode} activeIndex={4}>
                 <News />
               </MainLayout>
             }
           />
           <Route
             path="events"
             element={
               <MainLayout mode={mode} setMode={setMode} activeIndex={5}>
                 <Events />
               </MainLayout>
             }
           />
           <Route
             path="profile/me"
             element={
               <MainLayout mode={mode} setMode={setMode} activeIndex={7}>
                 <UpdateProfile />
               </MainLayout>
             }
           />
           <Route
             path="fundraise"
             element={
               <MainLayout mode={mode} setMode={setMode} activeIndex={6}>
                 <Fundraise />
               </MainLayout>
             }
           />
         </Routes>
       );
     }
   };

export default RoleBasedRoutes;
