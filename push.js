var senderId = "230301652836";
var messaging;


function Check() {
  // firebase_subscribe.js
  if (!firebase.apps.length) {
    firebase.initializeApp({
      messagingSenderId: senderId
    });
  }

  // Проверяем, поддерживает ли браузер уведомления:
  // (вообще, эту проверку должна делать библиотека Firebase, но она этого не делает :3 )
  if ('Notification' in window) {
    messaging = firebase.messaging();
    var currentToken = localStorage.getItem("sentFirebaseMessagingToken");
    console.log("Token in LocalStorage: " + currentToken);
    $('.log_table').append("<tr><td>Токен из LocalStorage: <b>" + currentToken + "</b></td></tr>"); // Дописываем log_table
    // подписываем на уведомления если ещё не подписали
    console.log("Subscribe...");
      $('.log_table').append("<tr><td>Подписываем на уведомления...</td></tr>"); // Дописываем log_table
      Subscribe();
  }
}

function Subscribe() {
  // запрашиваем разрешение на получение уведомлений:
  messaging.requestPermission()
    .then(function () {
      // получаем ID устройства
      messaging.getToken()
        .then(function (currentToken) {
          console.log("currentToken: " + currentToken);
          $('.log_table').append("<tr><td>Получен токен: <b>" + currentToken + "</b></td></tr>"); // Дописываем log_table
          if (currentToken) {
            console.log("Sending currentToken to GoogleApi...")
            $('.log_table').append("<tr><td>Отправляем токен на сервер [GoogleApi]...</td></tr>"); // Дописываем log_table
            sendTokenToServer(currentToken);
          } else {
            console.warn('Can not get token');
            $('.log_table').append("<tr><td>Не удалось получить токен!</td></tr>"); // Дописываем log_table
            setTokenSentToServer(false);
          }
        })
        .catch(function (err) {
          console.warn('Error: ', err);
          $('.log_table').append("<tr><td>При получении токена произошла ошибка: " +err + "</td></tr>"); // Дописываем log_table
          setTokenSentToServer(false);
        });
    })
    .catch(function (err) {
      console.warn('Can not get notifications permission: ', err);
      $('.log_table').append("<tr><td>Не удалось получить разрешение на показ уведомлений: " +err + "</td></tr>"); // Дописываем log_table
    });
}

// отправка ID на сервер
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer(currentToken)) {
    console.log('Sending token to server...');
    $('.log_table').append("<tr><td>Отправка токена на наш сервер [пока пусто]...</td></tr>"); // Дописываем log_table
    var url = ''; // адрес скрипта на сервере который сохраняет ID устройства
    $.post(url, {
      token: currentToken
    });
    setTokenSentToServer(currentToken);
  } else {
    $('.log_table').append("<tr><td>Отправка токена на наш сервер [пока пусто]...</td></tr>"); // Дописываем log_table
  }
}

// используем localStorage для отметки того,
// что пользователь уже подписался на уведомления:
function isTokenSentToServer(currentToken) {
  return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
  window.localStorage.setItem(
    'sentFirebaseMessagingToken',
    currentToken ? currentToken : ''
  );
}
var sp
// по клику запрашиваем у пользователя разрешение на уведомления и запускаем все функции:
$(".push_btn#sc").on('click', function () {
  sp = $('.spinner');
  $(".spinner").css("display","unset");
  $('.push_btn').css("display","none");
  Check();
  $('.spinner').css("display","none");
  $('.push_btn').css("display","unset");
});

// Очистка storage:
function ClearStorage() {
  localStorage.clear();
}
$(".clear_btn").on("click", function() { 
  ClearStorage();
  $('.log_table').append("<tr><td>LocalStorage очищено</td></tr>"); // Дописываем log_table
});
