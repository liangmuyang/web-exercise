let container = document.querySelector('.container');

// 创建拖放项目
((count, elName) => {
  let fragment = document.createDocumentFragment();
  for (let i=0; i<count; i++) {
    let li = document.createElement(elName);
    li.draggable = 'true';
    li.id = 'drag' + i;
    li.textContent = 'demo text' + i;
    li.classList.add('drag-item');
    fragment.appendChild(li);
  }

  container.appendChild(fragment);
})(8, 'li');

let 
dragoverTop = 'dragover-top', // css class
dragoverBottom = 'dragover-bottom', // css class
dragover = 'dragover', // css class
dargTarget = null,
dragHandlers = {
  dragstart(e) {
    dargTarget = e.target; // 标记被拖拽的目标
    e.dataTransfer.setDragImage(e.target, 0, 0);
  },
  dragenter(e) {
    let target = e.target;
    if (target !== dargTarget && target !== container) {
      e.preventDefault();
      // 在 dragenter 事件中，只关注 top 和 bottom 区域
      switch (whereMouseOver(e)) {
        case 'top':
          target.classList.toggle(dragoverTop, true);
          break;
        case 'bottom':
          target.classList.toggle (dragoverBottom, true);
          break;
      }
    }
  },
  dragover() {
    let timer = null;
    let delay = 100;
    return (e) => {
      let target = e.target;
      if (target !== dargTarget && target !== container) {
        e.preventDefault();
        switch (whereMouseOver(e)) {
          case 'top':
            if (timer) {
              // 当鼠标进入 top 时，取消 middle 未执行的操作（如果有的话）
              clearTimeout(timer);
              timer = null;
            }
            target.classList.toggle(dragoverTop, true);
            target.classList.toggle(dragoverBottom, false);
            break;
          case 'middle':
            if (!timer) {
              // 为了让拖放动画看上去流畅些，延迟移除 dragoverTop 或 dragoverBottom 类
              timer = setTimeout(() => {
                target.classList.toggle(dragoverTop, false);
                target.classList.toggle(dragoverBottom, false);
                timer = null;
              }, delay);
            }
            break;
          case 'bottom':
            if (timer) {
              // 当鼠标进入 bottom 时，取消未执行的操作（如果有的话）
              clearTimeout(timer);
              timer = null;
            }
            target.classList.toggle (dragoverTop, false);
            target.classList.toggle (dragoverBottom, true);
            break;
        }
      }
    };
  },
  dragleave(e) {
    // 离开放置目标时，重置放置目标
    let target = e.target;
    setTimeout(function() {
      target.classList.toggle(dragoverTop, false);
      target.classList.toggle(dragoverBottom, false);
    }, 100);

  },
  drop(e) {
    let target = e.target;
    target.classList.toggle(dragoverTop, false);
    target.classList.toggle(dragoverBottom, false);
    switch (whereMouseOver(e)) {
      case 'top':
        container.insertBefore(dargTarget, target);
        break;
      case 'bottom':
        container.insertBefore(dargTarget, target.nextSibling);
        break;
    }
  },
  dragend(e) {
    dargTarget = null;
  }
};

for (let eventName in dragHandlers) {
  if (eventName === 'dragover') {
    container.addEventListener(eventName, dragHandlers[eventName]());
    continue;
  }
  container.addEventListener(eventName, dragHandlers[eventName]);
}

// 返回鼠标所处的区域（垂直方向）
function whereMouseOver(e) {
  let range = 4; // top 和 bottom 的范围为 border-[top|bottom]-width + range
  if (e.offsetY < range) {
    return 'top';
  } else if (e.offsetY <= (e.target.clientHeight - range)) {
    return 'middle'
  } else {
    return 'bottom';
  }
}
