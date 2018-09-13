var senderId = "1001598796672";
var messaging;


function Check() {
  // firebase_subscribe.js
  firebase.initializeApp({
    messagingSenderId: senderId
  });

  // Проверяем, поддерживает ли браузер уведомления:
  // (вообще, эту проверку должна делать библиотека Firebase, но она этого не делает :3 )
  if ('Notification' in window) {
    messaging = firebase.messaging();
    // var curToken;
    // messaging.getToken().then(function (currentToken) {curToken = currentToken});
    var currentToken = localStorage.getItem("sentFirebaseMessagingToken");
    console.log("Пользователь уже подписан на уведомления, токен: " + currentToken);
    // подписываем на уведомления если ещё не подписали
    if (Notification.permission === 'granted') {
      console.log("Подписываем на уведомления...");
      Subscribe();
    }
  }
}

function Subscribe() {
  // запрашиваем разрешение на получение уведомлений:
  messaging.requestPermission()
    .then(function () {
      // получаем ID устройства
      messaging.getToken()
        .then(function (currentToken) {
          console.log("Текущий токен: " + currentToken);
          document.write("Токен: " + currentToken);
          // alert(currentToken);
          if (currentToken) {
            console.log("Отправляем токен на сервер googleapi...")
            sendTokenToServer(currentToken);
          } else {
            // alert('Не удалось получить токен.');
            console.warn('Не удалось получить токен');
            setTokenSentToServer(false);
          }
        })
        .catch(function (err) {
          // alert('При получении токена произошла ошибка: ' + err);
          console.warn('При получении токена произошла ошибка.', err);
          setTokenSentToServer(false);
        });
    })
    .catch(function (err) {
      // alert('Не удалось получить разрешение на показ уведомлений: ' + err);
      console.warn('Не удалось получить разрешение на показ уведомлений.', err);
    });
}

// отправка ID на сервер
function sendTokenToServer(currentToken) {
  if (!isTokenSentToServer(currentToken)) {
    console.log('Отправка токена на наш сервер...');
    var url = ''; // адрес скрипта на сервере который сохраняет ID устройства
    $.post(url, {
      token: currentToken
    });
    setTokenSentToServer(currentToken);
  } else {
    console.log('Токен уже отправлен на сервер.');
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

// по клику запрашиваем у пользователя разрешение на уведомления и запускаем все функции:
$(".push_btn#sc").on('click', function () {
  Check();
  // Subscribe();
});