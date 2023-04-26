async function getReservations() {
  const response = await fetch('https://frontend.tabling.co.kr/v1/store/9533/reservations');
  const data = await response.json();
  return data.reservations;
}

function createReservationItem(reservation) {
  const item = document.createElement('div');
  item.className = 'reservation-item';
  item.setAttribute('data-id', reservation.id);

  const left = document.createElement('div');
  left.className = 'left';
  const time = document.createElement('div');
  time.textContent = reservation.timeReserved.slice(11, 16);
  left.appendChild(time);

  const status = document.createElement('div');
  status.textContent = reservation.status === 'reserved' ? '예약' : '착석 중';
  status.style.color = reservation.status === 'reserved' ? '#3BB94C' : '#162149';
  left.appendChild(status);

  const middle = document.createElement('div');
  middle.className = 'middle';
  const title = document.createElement('div');
  title.textContent = `${reservation.customer.name} - ${reservation.tables.map((table) => table.name).join(', ')}`;
  middle.appendChild(title);

  const visitor = document.createElement('div');
  visitor.textContent = `성인 ${reservation.customer.adult} 아이 ${reservation.customer.child}`;
  middle.appendChild(visitor);

  const menu = document.createElement('div');
  menu.textContent = reservation.menus.map((menu) => `${menu.name}(${menu.qty})`).join(', ');
  middle.appendChild(menu);

  const right = document.createElement('div');
  right.className = 'right';
  const button = document.createElement('button');
  button.textContent = reservation.status === 'reserved' ? '착석' : '퇴석';
  button.onclick = () => {
    if (reservation.status === 'reserved') {
      button.textContent = '퇴석';
      reservation.status = 'seated';
    } else {
      item.remove();
    }
  };
  right.appendChild(button);

  item.appendChild(left);
  item.appendChild(middle);
  item.appendChild(right);

  item.onclick = () => {
    showReservationDetail(reservation);
  };

  return item;
}

function createReservationDetail(reservation, closeButton) {
  const { level, memo, name, request } = reservation.customer;
  const detail = document.createElement('div');

  const title = document.createElement('div');
  title.innerHTML = `<h3>예약 정보</h3>`;
  title.className = 'reservationTitle';
  title.appendChild(closeButton);
  detail.appendChild(title);

  const status = document.createElement('div');
  status.innerHTML = `
    <p>
        <span class="label">예약 상태</span>
        <span class="value">${reservation.status === 'seated' ? '착석중' : '예약'}</span>
    </p>`;
  detail.appendChild(status);

  const timeReserved = document.createElement('div');
  timeReserved.innerHTML = `
  <p>
      <span class="label">예약 시간</span>
      <span class="value">${reservation.timeReserved}</span>
  </p>`;
  detail.appendChild(timeReserved);

  const timeRegistered = document.createElement('div');
  timeRegistered.innerHTML = `
  <p>
      <span class="label">접수 시간</span>
      <span class="value">${reservation.timeRegistered}</span>
  </p>`;
  detail.appendChild(timeRegistered);

  const clientTitle = document.createElement('div');
  clientTitle.textContent = '고객 정보';
  clientTitle.className = 'clientTitle';
  detail.appendChild(clientTitle);

  const clientName = document.createElement('div');
  clientName.textContent = `고객 성명 ${name}`;
  clientName.innerHTML = `
    <p>
        <span class="label">고객 성명</span>
        <span class="value">${name}</span>
    </p>`;
  detail.appendChild(clientName);

  const clientGrade = document.createElement('div');
  clientGrade.innerHTML = `
  <p>
      <span class="label">고객 등급</span>
      <span class="value">${level}</span>
  </p>`;
  detail.appendChild(clientGrade);

  const clientMemo = document.createElement('div');
  clientMemo.textContent = `고객 메모 ${memo}`;
  clientMemo.innerHTML = `
  <p>
      <span class="label">고객 메모</span>
      <span class="value">${memo}</span>
  </p>`;
  detail.appendChild(clientMemo);

  const clientRequest = document.createElement('div');
  clientRequest.textContent = `요청 사항: ${request}`;
  clientRequest.innerHTML = `
  <p>
      <span class="label">요청 사항</span>
      <span class="value">${request}</span>
  </p>`;
  detail.appendChild(clientRequest);

  return detail;
}

function showReservationDetail(reservation) {
  const reservationDetail = document.querySelector('.reservation-detail');
  const closeButton = document.createElement('button');
  closeButton.className = 'close-button';
  closeButton.textContent = '닫기';

  const detail = createReservationDetail(reservation, closeButton);

  if (window.innerWidth < 1024) {
    const popup = document.createElement('div');
    popup.className = 'reservation-detail-popup';
    closeButton.onclick = () => {
      document.body.removeChild(popup);
    };

    popup.appendChild(detail);

    popup.onclick = (e) => {
      if (e.target === popup) {
        document.body.removeChild(popup);
      }
    };

    document.body.appendChild(popup);
  } else {
    if (reservationDetail.firstElementChild) {
      reservationDetail.replaceChild(detail, reservationDetail.firstElementChild);
    } else {
      reservationDetail.appendChild(detail);
    }
  }
}
(async function () {
  const reservations = await getReservations();
  const reservationList = document.querySelector('.reservation-list');
  for (const reservation of reservations) {
    const item = createReservationItem(reservation);
    reservationList.appendChild(item);
  }
})();
