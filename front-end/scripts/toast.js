window.onload = async () => {
    try {
        const response = await fetch('/api/notification');
        const data = await response.json();

        if (data.success === "true") {
            const toast = document.getElementById('toast');
            const message = document.getElementById('message');
            message.textContent = data.message; // Changed this line
            toast.classList.add(data.type);
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 10000);

            toast.addEventListener('click', () => {
                toast.classList.remove('show');
            });
        }
    } catch (error) {
        console.error('Failed to fetch notification:', error);
    }
};
