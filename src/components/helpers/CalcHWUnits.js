/**
<script>
    (function () {
        /**
         * Solve max height issue on mobile browsers - adaptation of:
         * https://stackoverflow.com/questions/29697883/100-height-on-mobile-browser-using-css
         * /

        // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
        function calcVH() {
            const vh = window.innerHeight * 0.01;
            const vw = window.innerWidth * 0.01;

            document.documentElement.style.setProperty('--mlt-vh', `${vh}px`);
            document.documentElement.style.setProperty('--mlt-vw', `${vw}px`);
        }

        // Then we set the value in the --vh custom property to the root of the document
        calcVH();

        // We listen to the resize event, and we execute the function
        window.addEventListener('resize', () => { calcVH(); });
    })();
</script>
**/
export default function CalcHWUnits() {
    const vh = window.innerHeight * 0.01;
    const vw = window.innerWidth * 0.01;

    document.documentElement.style.setProperty('--mlt-vh', `${vh}px`);
    document.documentElement.style.setProperty('--mlt-vw', `${vw}px`);
    document.documentElement.style.setProperty('--mlt-vmin', `${(vh > vw) ? vw : vh}px`);
}