var audioElement = document.getElementById("audio");

function audi() {
    if (audioElement) {
        audioElement.currentTime = 0.6;
        audioElement.play();
    }
}

function sendKeyPress(key) {
    let event = new KeyboardEvent("keydown", { key: key });
    document.dispatchEvent(event);
}

document.addEventListener("DOMContentLoaded", function () {
    let buttons = {
        bu1: "a",
        bu2: "b",
        bu3: "c",
        bu4: "d"
    };

    Object.keys(buttons).forEach(id => {
        let button = document.getElementById(id);
        if (button) {
            button.addEventListener("click", () => {
                sendKeyPress(buttons[id]); // Simulate key press
                audi(); // Play audio
            });
        }
    });

    // Improved Joystick Code
    const joystick = document.getElementById("joystick");
    const container = document.getElementById("joystick-container");
    let isDragging = false;
    let centerX = container.offsetWidth / 2;
    let centerY = container.offsetHeight / 2;
    let joystickX = 0;
    let joystickY = 0;

    container.addEventListener("touchstart", startDrag);
    container.addEventListener("touchmove", moveJoystick);
    container.addEventListener("touchend", resetJoystick);
    container.addEventListener("mousedown", startDrag);
    container.addEventListener("mousemove", moveJoystick);
    container.addEventListener("mouseup", resetJoystick);

    function startDrag(event) {
        isDragging = true;
        moveJoystick(event);
    }

    function moveJoystick(event) {
        if (!isDragging) return;

        let touch = event.touches ? event.touches[0] : event;
        let rect = container.getBoundingClientRect();
        let x = touch.clientX - rect.left - centerX;
        let y = touch.clientY - rect.top - centerY;
        let distance = Math.sqrt(x * x + y * y);
        let maxDistance = centerX - 30;

        if (distance > maxDistance) {
            x = (x / distance) * maxDistance;
            y = (y / distance) * maxDistance;
        }

        joystick.style.transform = `translate(${x}px, ${y}px)`;

        joystickX = x;
        joystickY = y;

        let direction = getDirection(x, y);
        if (direction) sendKeyPress(direction);
    }

    function resetJoystick() {
        isDragging = false;
        smoothReturn();
    }

    function smoothReturn() {
        let interval = setInterval(() => {
            joystickX *= 0.8;
            joystickY *= 0.8;
            joystick.style.transform = `translate(${joystickX}px, ${joystickY}px)`;

            if (Math.abs(joystickX) < 0.5 && Math.abs(joystickY) < 0.5) {
                clearInterval(interval);
                joystick.style.transform = "translate(0, 0)";
            }
        }, 10);
    }

    function getDirection(x, y) {
        let threshold = 15;

        if (y < -threshold) return "ArrowUp";
        if (y > threshold) return "ArrowDown";
        if (x < -threshold) return "ArrowLeft";
        if (x > threshold) return "ArrowRight";

        return null;
    }
});
