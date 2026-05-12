const title = document.getElementById('main-title');
title.style.color = 'blue';

let btn = document.getElementById('add-btn');

btn.addEventListener('mouseover', function() {
    btn.style.backgroundColor = 'yellow';
});
btn.addEventListener('mouseout', function() {
    btn.style.backgroundColor = 'black'; });  


const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');

btn.addEventListener('click', function() {
    const taskText = input.value;

     if (taskText !== "") { 
    const newLi = document.createElement('li');
    newLi.textContent = taskText;
    newLi.classList.add('task-item');
    
    newLi.addEventListener('click', function() {
            newLi.remove(); 
        });
    list.appendChild(newLi);
    input.value = ''; }
});
