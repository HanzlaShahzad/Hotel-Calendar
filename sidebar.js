(function () {

  function initSidebar() {

    const sidebar = document.getElementById("sidebar");

    if (!sidebar) {
      return;
    }


    /*
    =====================================================
    CURRENT PAGE
    =====================================================
    */

    let currentPage = window.location.pathname
      .split("/")
      .pop()
      .toLowerCase();

    if (!currentPage) {
      currentPage = "page1.html";
    }


    /*
    =====================================================
    CALENDAR PAGES
    =====================================================
    */

    const calendarPages = [
      "page1.html",
      "page2.html",
      "page3.html",
      "page5.html"
    ];


    const isCalendarPage =
      calendarPages.indexOf(currentPage) !== -1;


    /*
    =====================================================
    SIDEBAR HTML
    ONLY TWO MAIN BUTTONS
    =====================================================
    */

    sidebar.innerHTML = `

            <div class="sidebar-inner">

                <div class="sidebar-title">
                    HOTEL
                </div>


                <nav class="sidebar-nav">


                    <!-- =====================================
                         NEW CHATS
                    ====================================== -->

                    <a
                        href="page4.html"
                        class="sidebar-link ${currentPage === "page4.html"
        ? "active"
        : ""
      }"
                    >

                        <span class="sidebar-number">
                            01
                        </span>

                        <span class="sidebar-name">
                            New Chats
                        </span>

                    </a>



                    <!-- =====================================
                         CALENDER
                    ====================================== -->

                    <button
                        type="button"
                        class="sidebar-link calendar-toggle ${isCalendarPage ? "active" : ""
      }"
                        id="calendarToggle"
                    >

                        <span class="sidebar-number">
                            02
                        </span>

                        <span class="sidebar-name">
                            Calender
                        </span>

                        <span class="calendar-arrow ${isCalendarPage ? "open" : ""
      }">
                            ▾
                        </span>

                    </button>



                    <!-- =====================================
                         CALENDAR SUB MENU
                    ====================================== -->

                    <div
                        class="calendar-submenu ${isCalendarPage ? "show" : ""
      }"
                        id="calendarSubmenu"
                    >


                        <!-- HOTEL DAY -->

                        <a
                            href="page1.html"
                            class="calendar-sub-link ${currentPage === "page1.html"
        ? "active"
        : ""
      }"
                        >

                            <span class="calendar-sub-number">
                                01
                            </span>

                            <span>
                                Hotel Day
                            </span>

                        </a>



                        <!-- MONTH -->

                        <a
                            href="page2.html"
                            class="calendar-sub-link ${currentPage === "page2.html"
        ? "active"
        : ""
      }"
                        >

                            <span class="calendar-sub-number">
                                02
                            </span>

                            <span>
                                Month
                            </span>

                        </a>



                        <!-- LAYERS -->

                        <a
                            href="page3.html"
                            class="calendar-sub-link ${currentPage === "page3.html"
        ? "active"
        : ""
      }"
                        >

                            <span class="calendar-sub-number">
                                03
                            </span>

                            <span>
                                Layers &amp; Sharing
                            </span>

                        </a>



                        <!-- PRESSURE -->

                        <a
                            href="page5.html"
                            class="calendar-sub-link ${currentPage === "page5.html"
        ? "active"
        : ""
      }"
                        >

                            <span class="calendar-sub-number">
                                04
                            </span>

                            <span>
                                Pressure
                            </span>

                        </a>


                    </div>


                </nav>

            </div>

        `;


    /*
    =====================================================
    CALENDAR TOGGLE
    =====================================================
    */

    const calendarToggle =
      document.getElementById(
        "calendarToggle"
      );


    const calendarSubmenu =
      document.getElementById(
        "calendarSubmenu"
      );


    const calendarArrow =
      calendarToggle.querySelector(
        ".calendar-arrow"
      );


    calendarToggle.addEventListener(
      "click",
      function () {

        calendarSubmenu.classList.toggle(
          "show"
        );

        calendarArrow.classList.toggle(
          "open"
        );

      }
    );

  }


  /*
  =====================================================
  START
  =====================================================
  */

  if (
    document.readyState === "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      initSidebar
    );

  } else {

    initSidebar();

  }

})();