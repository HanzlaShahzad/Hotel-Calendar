(function () {

    function resizeFrames() {

        var frames = document.querySelectorAll(
            ".calendar-frame"
        );


        frames.forEach(function (frame) {

            frame.onload = function () {

                try {

                    var documentElement =
                        frame.contentWindow.document.documentElement;

                    var body =
                        frame.contentWindow.document.body;


                    var height = Math.max(
                        documentElement.scrollHeight,
                        documentElement.offsetHeight,
                        body ? body.scrollHeight : 0,
                        body ? body.offsetHeight : 0
                    );


                    frame.style.height =
                        (height + 20) + "px";

                } catch (error) {

                    /*
                     * Same-origin pages should allow
                     * automatic height calculation.
                     */

                    console.log(
                        "Calendar frame resize:",
                        error
                    );

                }

            };

        });

    }


    document.addEventListener(
        "DOMContentLoaded",
        resizeFrames
    );


    window.addEventListener(
        "resize",
        resizeFrames
    );

})();