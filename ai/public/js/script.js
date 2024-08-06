$(document).ready(function () {
    $('#send-button').click(function () {
        const message = $('#message-input').val();
        if (message.trim() === '') return;

        $('#chat-messages').append(`
        <div class="message user-message">
          <img src="/images/user-icon.png" class="icon" alt="User Icon">
          <div class="message-text">${message}</div>
        </div>
      `);

        $('#message-input').val('');
        $('#chat-messages').append(`
        <div class="message bot-message typing-animation">
          <img src="/images/bot-icon.png" class="icon" alt="Bot Icon">
          <div class="message-text">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </div>
        </div>
      `);
        $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);

        $.ajax({
            url: '/chat',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ prompt: message }),
            success: function (response) {
                const formattedText = marked.parse(response.text);
                $('.typing-animation').remove();
                $('#chat-messages').append(`
            <div class="message bot-message">
              <img src="/images/bot-icon.png" class="icon" alt="Bot Icon">
              <div class="message-text">${formattedText}</div>
            </div>
          `);
                $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
            },
            error: function () {
                $('.typing-animation').remove();
                $('#chat-messages').append(`
            <div class="message bot-message">
              <img src="/images/bot-icon.png" class="icon" alt="Bot Icon">
              <div class="message-text">Error processing your request.</div>
            </div>
          `);
            }
        });
    });

    $('#message-input').keypress(function (e) {
        if (e.which == 13) {
            $('#send-button').click();
        }
    });
});