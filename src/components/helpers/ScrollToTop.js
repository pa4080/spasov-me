/**
 * Workaround implementation of:
 * https://v5.reactrouter.com/web/guides/scroll-restoration
 */
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        console.log(pathname);
        window.document.querySelector('.mlt-pages').scrollTo(0, 0);
    }, [pathname]);

    return null;
}