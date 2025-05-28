import HeaderComponent from "../component/headerComponent";
import FooterComponent from "../component/FooterComponent";
import { Outlet } from "react-router-dom";

const LayoutComponent = () => {
    // document.addEventListener('contextmenu', function (e) {
    //     e.preventDefault();
    // })
    // document.onkeydown = function (e) {
    //     if (Event.keyCode === 123) {
    //         return false;
    //     }
    //     if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) {
    //         return false;
    //     }
    //     if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) {
    //         return false;
    //     }
    //     if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) {
    //         return false;
    //     }
    // }

    return (
        <div className="flex flex-col justify-between">
            <HeaderComponent />
            <Outlet />
            <FooterComponent />
            {/* <ScrollToTop /> */}
        </div>
    );
};

export default LayoutComponent