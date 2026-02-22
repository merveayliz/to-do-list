// --- GÜNCELLENMİŞ SCRIPT.JS ---

let currentPage = 1;
const totalPages = 10;
let plannerData = JSON.parse(localStorage.getItem('myPlanner')) || {};

window.onload = () => {
    loadPageData();
    const savedTheme = localStorage.getItem('theme') || 'theme-purple';
    changeTheme(savedTheme);
};

// Sayfa Değiştirme
function changePage(step) {
    saveCurrentPageData(); 
    currentPage += step;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    document.getElementById('page-num').innerText = `${currentPage} / ${totalPages}`;
    document.getElementById('page-title').innerText = `Günlük Planlayıcı - Sayfa ${currentPage}`;
    loadPageData();
}

// Veriyi Kaydet
function saveCurrentPageData() {
    const todos = [];
    document.querySelectorAll('.todo-item').forEach(item => {
        // Checkbox durumunu doğru yakalamak için
        const isChecked = item.classList.contains('checked');
        todos.push({
            text: item.querySelector('span').innerText,
            completed: isChecked
        });
    });

    plannerData[currentPage] = {
        date: document.getElementById('date-input').value,
        mood: document.getElementById('mood-text').value,
        todos: todos
    };

    localStorage.setItem('myPlanner', JSON.stringify(plannerData));
    updateProgress(); // Her kayıtta çubuğu güncelle
}

// Veriyi Yükle
function loadPageData() {
    const data = plannerData[currentPage] || { date: '', mood: '', todos: [] };
    document.getElementById('date-input').value = data.date || "";
    document.getElementById('mood-text').value = data.mood || "";
    const listDiv = document.getElementById('todo-list');
    listDiv.innerHTML = '';
    if(data.todos) {
        data.todos.forEach(todo => renderTodo(todo.text, todo.completed));
    }
    updateProgress(); // Sayfa açılınca çubuğu güncelle
}

// To-do Ekleme
function addTodo() {
    const input = document.getElementById('todo-input');
    if (input.value.trim() === "") return;
    renderTodo(input.value, false);
    input.value = "";
    saveCurrentPageData();
}

// TEK VE GÜNCEL RENDER FONKSİYONU
function renderTodo(text, isChecked) {
    const listDiv = document.getElementById('todo-list');
    const div = document.createElement('div');
    div.className = `todo-item ${isChecked ? 'checked' : ''}`;
    
    div.innerHTML = `
        <div class="custom-checkbox"></div>
        <span style="flex: 1;">${text}</span>
        <span class="delete-btn" onclick="event.stopPropagation(); todoSil(this, '${text}')">🗑️</span>
    `;
    
    // Satıra tıklandığında tamamlama özelliği
    div.onclick = () => toggleTodo(div);
    listDiv.appendChild(div);
    updateProgress();
}

// Tik atma işlemi
function toggleTodo(itemElement) {
    itemElement.classList.toggle('checked');
    saveCurrentPageData();
}

// Silme Fonksiyonu
function todoSil(buton, silinecekMetin) {
    buton.parentElement.remove();
    const sayfaGorevleri = plannerData[currentPage].todos || [];
    plannerData[currentPage].todos = sayfaGorevleri.filter(t => t.text !== silinecekMetin);
    localStorage.setItem('myPlanner', JSON.stringify(plannerData));
    updateProgress();
}

// İlerleme Çubuğu Güncelleme
function updateProgress() {
    const total = document.querySelectorAll('.todo-item').length;
    const completed = document.querySelectorAll('.todo-item.checked').length;
    const percent = total === 0 ? 0 : (completed / total) * 100;
    const progressBar = document.getElementById('progress-bar');
    if(progressBar) {
        progressBar.style.width = percent + "%";
    }
}

// Tema Değiştirme
function changeTheme(themeName) {
    document.body.className = themeName;
    localStorage.setItem('theme', themeName);
}

// Otomatik Kayıt Dinleyicileri
document.getElementById('mood-text').addEventListener('input', saveCurrentPageData);
document.getElementById('date-input').addEventListener('change', saveCurrentPageData);