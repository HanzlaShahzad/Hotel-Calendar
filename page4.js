$(document).ready(function () {

  /* =========================================================
     DUMMY SMS RESPONSES
     ========================================================= */

  var dummyResponses = [
    {
      sender: "Ana",
      message: "Got it. I’ll check room 618 now."
    },
    {
      sender: "Maria",
      message: "I have the spare cartridge. I’m heading there now."
    },
    {
      sender: "Ana",
      message: "The guest has been updated. They are waiting in the room."
    },
    {
      sender: "Maria",
      message: "Everything is ready. I’ll take care of it."
    },
    {
      sender: "Ana",
      message: "I’ve contacted housekeeping. Someone will be there shortly."
    },
    {
      sender: "Maria",
      message: "The room request has been received. I’m handling it now."
    }
  ];

  var responseIndex = 0;


  /* =========================================================
     CURRENT TIME
     ========================================================= */

  function getCurrentTime() {

    var now = new Date();

    return now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit"
    });
  }


  /* =========================================================
     SCROLL CHAT TO BOTTOM
     ========================================================= */

  function scrollChat() {

    var chat = $(".chat-messages");

    if (!chat.length) {
      return;
    }

    chat.stop().animate(
      {
        scrollTop: chat[0].scrollHeight
      },
      250
    );
  }


  /* =========================================================
     SEND SMS
     ========================================================= */

  function sendMessage() {

    var input = $(".message-input").first();

    if (!input.length) {
      return;
    }

    var message = $.trim(input.val());

    if (message === "") {
      input.focus();
      return;
    }


    /* ---------------------------------------------------------
       CURRENT TIME
       --------------------------------------------------------- */

    var currentTime = getCurrentTime();


    /* ---------------------------------------------------------
       CREATE MY MESSAGE
       --------------------------------------------------------- */

    var userMessage = $(
      '<div class="my-message-wrapper new-message">' +

      '<div class="my-message-meta">' +

      '<span class="message-name">' +
      'You' +
      '</span>' +

      '<span class="message-time">' +
      currentTime +
      '</span>' +

      '</div>' +

      '<div class="my-message">' +

      '<div class="message-text"></div>' +

      '<div class="read-status">' +
      'Sending...' +
      '</div>' +

      '</div>' +

      '</div>'
    );


    /*
     * .text() is intentional.
     * It safely inserts the user's message.
     */

    userMessage
      .find(".message-text")
      .text(message);


    /* ---------------------------------------------------------
       ADD MESSAGE IMMEDIATELY
       --------------------------------------------------------- */

    $(".chat-messages").append(userMessage);


    /* ---------------------------------------------------------
       CLEAR INPUT IMMEDIATELY
       --------------------------------------------------------- */

    input.val("");
    input.focus();


    /* ---------------------------------------------------------
       SCROLL
       --------------------------------------------------------- */

    scrollChat();


    /* ---------------------------------------------------------
       SENT STATUS
       --------------------------------------------------------- */

    setTimeout(function () {

      userMessage
        .find(".read-status")
        .text("Sent");

    }, 300);


    /* ---------------------------------------------------------
       READ STATUS
       --------------------------------------------------------- */

    setTimeout(function () {

      userMessage
        .find(".read-status")
        .text("Read by 3");

    }, 700);


    /* =========================================================
       SHOW TYPING INDICATOR
       ========================================================= */

    showTypingIndicator();


    /* =========================================================
       RESPONSE AFTER 1 SECOND
       ========================================================= */

    setTimeout(function () {

      hideTypingIndicator();

      addDummyResponse();

    }, 1000);
  }


  /* =========================================================
     TYPING INDICATOR
     ========================================================= */

  function showTypingIndicator() {

    hideTypingIndicator();

    var typingIndicator = $(
      '<div class="dummy-typing-indicator" id="dummyTypingIndicator">' +
      '<span class="typing-dots">...</span>' +
      '</div>'
    );

    $(".chat-messages").append(typingIndicator);

    scrollChat();
  }


  function hideTypingIndicator() {

    $("#dummyTypingIndicator").remove();
  }


  /* =========================================================
     HIDE TYPING INDICATOR
     ========================================================= */

  function hideTypingIndicator() {

    $("#dummyTypingIndicator").remove();
  }


  /* =========================================================
     ADD DUMMY SMS RESPONSE
     ========================================================= */

  function addDummyResponse() {

    var response =
      dummyResponses[
      responseIndex % dummyResponses.length
      ];

    responseIndex++;


    var responseTime = getCurrentTime();


    /* ---------------------------------------------------------
       CREATE INCOMING SMS
       --------------------------------------------------------- */

    var incomingMessage = $(
      '<div class="message-row new-message">' +

      '<div class="avatar">' +
      response.sender.charAt(0) +
      '</div>' +

      '<div class="message-content">' +

      '<div class="message-meta">' +

      '<span class="message-name"></span>' +

      '<span class="language">' +
      'SMS' +
      '</span>' +

      '<span class="message-time"></span>' +

      '</div>' +

      '<div class="message-text"></div>' +

      '<div class="message-options">' +

      '<button type="button" class="message-option">' +
      'Original' +
      '</button>' +

      '<button type="button" class="message-option">' +
      'Read aloud' +
      '</button>' +

      '<button type="button" class="message-option reply-action">' +
      'Reply' +
      '</button>' +

      '</div>' +

      '</div>' +

      '</div>'
    );


    /* ---------------------------------------------------------
       INSERT RESPONSE DATA
       --------------------------------------------------------- */

    incomingMessage
      .find(".message-name")
      .text(response.sender);

    incomingMessage
      .find(".message-time")
      .text(responseTime);

    incomingMessage
      .find(".message-text")
      .text(response.message);


    /* ---------------------------------------------------------
       ADD RESPONSE
       --------------------------------------------------------- */

    $(".chat-messages").append(incomingMessage);


    /* ---------------------------------------------------------
       SCROLL
       --------------------------------------------------------- */

    scrollChat();
  }


  /* =========================================================
     SEND BUTTON
     ========================================================= */

  $(document).on("click", ".send-button", function (e) {

    e.preventDefault();

    sendMessage();
  });


  /* =========================================================
     ENTER TO SEND
     ========================================================= */

  $(document).on("keydown", ".message-input", function (e) {

    if (e.key === "Enter") {

      e.preventDefault();

      sendMessage();
    }
  });


  /* =========================================================
     REPLY BUTTON
     ========================================================= */

  $(document).on("click", ".reply-action", function (e) {

    e.preventDefault();


    var messageRow = $(this).closest(".message-row");


    var messageText = $.trim(
      messageRow
        .find(".message-text")
        .first()
        .text()
    );


    if (messageText === "") {
      return;
    }


    $(".message-input")
      .val("@ " + messageText + " ")
      .focus();
  });


  /* =========================================================
     CHANNEL DROPDOWN
     ========================================================= */

  $(document).on("click", ".channel-btn", function (e) {

    e.preventDefault();
    e.stopPropagation();


    $(".channel-menu").toggleClass("open");

    $(".chat-more-menu").removeClass("open");
  });


  /* =========================================================
     CHANGE CHANNEL
     ========================================================= */

  $(document).on("click", ".channel-option", function (e) {

    e.preventDefault();
    e.stopPropagation();


    var channel = $(this).data("channel");


    $("#channelName").text(channel);

    $(".channel-menu").removeClass("open");


    /*
     * Update request text depending on selected channel.
     */

    if (channel === "Room 618") {

      $(".request-subtitle").text(
        "Extra towels requested for room 618."
      );

    } else if (channel === "Front Desk") {

      $(".request-subtitle").text(
        "Front desk operational conversation."
      );

    } else if (channel === "Housekeeping") {

      $(".request-subtitle").text(
        "Housekeeping requests and room updates."
      );

    } else if (channel === "Maintenance") {

      $(".request-subtitle").text(
        "Maintenance issues and operational updates."
      );
    }
  });


  /* =========================================================
     MORE MENU
     ========================================================= */

  $(document).on("click", ".more-btn", function (e) {

    e.preventDefault();
    e.stopPropagation();


    $(".chat-more-menu").toggleClass("open");

    $(".channel-menu").removeClass("open");
  });


  /* =========================================================
     CLOSE DROPDOWN MENUS
     ========================================================= */

  $(document).on("click", function () {

    $(".channel-menu").removeClass("open");

    $(".chat-more-menu").removeClass("open");
  });


  /* =========================================================
     PREVENT MENU CLOSE
     ========================================================= */

  $(document).on(
    "click",
    ".channel-menu, .chat-more-menu",
    function (e) {

      e.stopPropagation();
    }
  );


  /* =========================================================
     SEARCH MESSAGES
     ========================================================= */

  $(document).on("input", ".chat-search", function () {

    var searchText = $.trim(
      $(this).val().toLowerCase()
    );


    $(".chat-messages .message-row, " +
      ".chat-messages .my-message-wrapper"
    ).each(function () {

      var messageText = $(this)
        .text()
        .toLowerCase();


      if (
        searchText === "" ||
        messageText.indexOf(searchText) !== -1
      ) {

        $(this).show();

      } else {

        $(this).hide();
      }
    });
  });


  /* =========================================================
     AUDIO PLAY BUTTON
     ========================================================= */

  $(document).on("click", ".play-button", function (e) {

    e.preventDefault();


    var button = $(this);


    if (button.hasClass("audio-playing")) {

      button
        .removeClass("audio-playing")
        .text("▶");

      return;
    }


    $(".play-button")
      .removeClass("audio-playing")
      .text("▶");


    button
      .addClass("audio-playing")
      .text("Ⅱ");


    setTimeout(function () {

      button
        .removeClass("audio-playing")
        .text("▶");

    }, 1800);
  });


  /* =========================================================
     ADD BUTTON
     ========================================================= */

  $(document).on("click", ".add-button", function () {

    $(".message-input")
      .focus();
  });


  /* =========================================================
     MICROPHONE
     ========================================================= */

  $(document).on("click", ".input-icon", function () {

    var input = $(".message-input").first();


    input
      .val("Voice message...")
      .focus();
  });


  /* =========================================================
     CALL BUTTON
     ========================================================= */

  $(document).on("click", ".call-btn", function () {

    showChatNotice(
      "Calling room 618..."
    );
  });


  /* =========================================================
     VIDEO BUTTON
     ========================================================= */

  $(document).on("click", ".video-btn", function () {

    showChatNotice(
      "Starting video call..."
    );
  });


  /* =========================================================
     MAKE REQUEST
     ========================================================= */

  $(document).on("click", ".make-request-btn", function (e) {

    e.preventDefault();
    e.stopPropagation();


    showChatNotice(
      "Request created successfully."
    );
  });


  /* =========================================================
     CHAT NOTICE
     ========================================================= */

  function showChatNotice(message) {

    $(".dummy-response-notice").remove();


    var notice = $(
      '<div class="dummy-response-notice"></div>'
    );


    notice.text(message);


    $(".chat-card").prepend(notice);


    setTimeout(function () {

      notice.fadeOut(
        200,
        function () {
          $(this).remove();
        }
      );

    }, 1600);
  }


  /* =========================================================
     MORE MENU ACTIONS
     ========================================================= */

  $(document).on("click", ".chat-more-option", function (e) {

    e.preventDefault();


    var action = $.trim($(this).text());


    if (action === "Mark as unread") {

      showChatNotice(
        "Conversation marked as unread."
      );

    } else if (action === "Archive conversation") {

      showChatNotice(
        "Conversation archived."
      );

    } else if (action === "Clear search") {

      $(".chat-search")
        .val("")
        .trigger("input");

      showChatNotice(
        "Search cleared."
      );
    }


    $(".chat-more-menu").removeClass("open");
  });


  /* =========================================================
     ORIGINAL BUTTON
     ========================================================= */

  $(document).on("click", ".message-option", function (e) {

    e.preventDefault();


    var action = $.trim($(this).text());


    if (action === "Original") {

      showChatNotice(
        "Original SMS text is already displayed."
      );

    } else if (action === "Read aloud") {

      showChatNotice(
        "Reading message aloud..."
      );
    }
  });


  /* =========================================================
     INITIAL SCROLL
     ========================================================= */

  setTimeout(function () {

    scrollChat();

  }, 200);

});