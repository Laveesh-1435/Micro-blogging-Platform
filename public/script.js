// DOM Elements
const composeInput = document.querySelector('.compose-input');
const composeButton = document.querySelector('.compose-button');
const flittActions = document.querySelectorAll('.flitt-action');
const replyButtons = document.querySelectorAll('.flitt-action.reply');
const likeButtons = document.querySelectorAll('.flitt-action.like');
const reflittButtons = document.querySelectorAll('.flitt-action.reflitt');
const commentSections = document.querySelectorAll('.comments-section');
const commentInputs = document.querySelectorAll('.comment-input');
const commentButtons = document.querySelectorAll('.comment-button');
const commentLikeButtons = document.querySelectorAll('.comment-action.like');
const modeToggle = document.getElementById('mode-toggle');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const flitterBtn = document.querySelector('.flitter-btn');
const modal = document.getElementById('flitt-modal');
const closeModal = document.querySelector('.close-modal');
const modalInput = document.querySelector('.modal-input');
const modalPostBtn = document.querySelector('.modal-post-btn');
const tabs = document.querySelectorAll('.tab');
const followButtons = document.querySelectorAll('.follow-btn');
// const authRoutes = require('apiRoutes');
// app.use('/api', authRoutes);
// Initialize state
let darkMode = false;

// Function to show toast notification
function showToast(message) {
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Function to toggle comments section
function toggleComments(index) {
    commentSections[index].classList.toggle('active');
}

// Function to update button state based on textarea content
function updateButtonState(textarea, button) {
    if (textarea.value.trim().length > 0) {
        button.removeAttribute('disabled');
    } else {
        button.setAttribute('disabled', 'disabled');
    }
}

// Function to toggle dark mode
function toggleDarkMode() {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode');
    
    // Update moon/sun icon
    if (darkMode) {
        modeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        modeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

// Function to create a new flitt
function createFlitt(content) {
    // Create flitt element
    const flittElement = document.createElement('div');
    flittElement.className = 'flitt';
    
    // Get current time
    const now = new Date();
    const minutes = Math.floor((now - new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0)) / 60000);
    
    flittElement.innerHTML = `
        <img src="./profile.jpg" alt="Your Profile" class="flitt-profile-pic">
        <div class="flitt-content">
            <div class="flitt-header">
                <span class="flitt-name">John Doe</span>
                <span class="flitt-handle">@johndoe</span>
                <span class="flitt-time">· just now</span>
                <div class="flitt-more">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <div class="flitt-text">
                ${content}
            </div>
            <div class="flitt-actions">
                <div class="flitt-action reply" data-count="0">
                    <i class="far fa-comment"></i>
                    <span>0</span>
                </div>
                <div class="flitt-action reflitt" data-count="0">
                    <i class="fas fa-retweet"></i>
                    <span>0</span>
                </div>
                <div class="flitt-action like" data-count="0">
                    <i class="far fa-heart"></i>
                    <span>0</span>
                </div>
                <div class="flitt-action share">
                    <i class="far fa-share-square"></i>
                </div>
            </div>
            <div class="comments-section">
                <div class="comment-input-container">
                    <img src="/api/placeholder/80/80" alt="Your Profile" class="comment-profile-pic">
                    <textarea class="comment-input" placeholder="Post your reply"></textarea>
                    <button class="comment-button" disabled>Reply</button>
                </div>
            </div>
        </div>
    `;
    
    // Add event listeners to the new flitt
    const newFlittActions = flittElement.querySelectorAll('.flitt-action');
    
    newFlittActions.forEach((action, index) => {
        if (action.classList.contains('like')) {
            action.addEventListener('click', () => toggleLike(action));
        } else if (action.classList.contains('reflitt')) {
            action.addEventListener('click', () => toggleReflitt(action));
        } else if (action.classList.contains('reply')) {
            action.addEventListener('click', () => toggleComments(flittElement));
        }
    });
    
    // Add new flitt to the feed
    const feed = document.querySelector('.feed');
    feed.insertBefore(flittElement, feed.firstChild);
    
    // Setup new comment input
    const newCommentInput = flittElement.querySelector('.comment-input');
    const newCommentButton = flittElement.querySelector('.comment-button');
    
    newCommentInput.addEventListener('input', () => {
        updateButtonState(newCommentInput, newCommentButton);
    });
    
    newCommentButton.addEventListener('click', () => {
        if (newCommentInput.value.trim()) {
            addComment(flittElement, newCommentInput.value);
            newCommentInput.value = '';
            updateButtonState(newCommentInput, newCommentButton);
        }
    });
    
    return flittElement;
}

// Function to add a comment to a flitt
function addComment(flittElement, commentText) {
    const commentsSection = flittElement.querySelector('.comments-section');
    const commentElement = document.createElement('div');
    commentElement.className = 'comment';
    
    commentElement.innerHTML = `
        <img src="/api/placeholder/80/80" alt="Your Profile" class="comment-profile-pic">
        <div class="comment-content">
            <div class="comment-header">
                <span class="comment-name">John Doe</span>
                <span class="comment-handle">@johndoe</span>
                <span class="comment-time">· just now</span>
            </div>
            <div class="comment-text">
                ${commentText}
            </div>
            <div class="comment-actions">
                <div class="comment-action reply">
                    <i class="far fa-comment"></i>
                </div>
                <div class="comment-action like" data-count="0">
                    <i class="far fa-heart"></i>
                    <span>0</span>
                </div>
            </div>
        </div>
    `;
    
    // Add like functionality to new comment
    const likeAction = commentElement.querySelector('.comment-action.like');
    likeAction.addEventListener('click', () => {
        toggleCommentLike(likeAction);
    });
    
    // Insert new comment after the comment input container
    const commentInputContainer = flittElement.querySelector('.comment-input-container');
    commentInputContainer.parentNode.insertBefore(commentElement, commentInputContainer.nextSibling);
    
    // Update reply count
    const replyAction = flittElement.querySelector('.flitt-action.reply');
    const replyCount = parseInt(replyAction.getAttribute('data-count')) + 1;
    replyAction.setAttribute('data-count', replyCount);
    replyAction.querySelector('span').textContent = replyCount;
}

// Function to toggle like state
function toggleLike(likeButton) {
    likeButton.classList.toggle('active');
    const countSpan = likeButton.querySelector('span');
    let count = parseInt(likeButton.getAttribute('data-count'));
    
    if (likeButton.classList.contains('active')) {
        count++;
        likeButton.querySelector('i').className = 'fas fa-heart';
    } else {
        count--;
        likeButton.querySelector('i').className = 'far fa-heart';
    }
    
    likeButton.setAttribute('data-count', count);
    countSpan.textContent = count;
}

// Function to toggle reflitt state
function toggleReflitt(reflittButton) {
    reflittButton.classList.toggle('active');
    const countSpan = reflittButton.querySelector('span');
    let count = parseInt(reflittButton.getAttribute('data-count'));
    
    if (reflittButton.classList.contains('active')) {
        count++;
        showToast('You reflitted this flitt!');
    } else {
        count--;
    }
    
    reflittButton.setAttribute('data-count', count);
    countSpan.textContent = count;
}

// Function to toggle comment like state
function toggleCommentLike(likeButton) {
    likeButton.classList.toggle('active');
    const countSpan = likeButton.querySelector('span');
    let count = parseInt(likeButton.getAttribute('data-count') || '0');
    
    if (likeButton.classList.contains('active')) {
        count++;
        likeButton.querySelector('i').className = 'fas fa-heart';
    } else {
        count--;
        likeButton.querySelector('i').className = 'far fa-heart';
    }
    
    likeButton.setAttribute('data-count', count);
    countSpan.textContent = count;
}

// Function to toggle the flitt modal
function toggleModal() {
    if (modal.style.display === 'block') {
        modal.style.display = 'none';
    } else {
        modal.style.display = 'block';
    }
}

// Event Listeners

// Compose input functionality
composeInput.addEventListener('input', () => {
    updateButtonState(composeInput, composeButton);
});

// Compose button click
composeButton.addEventListener('click', () => {
    if (composeInput.value.trim()) {
        createFlitt(composeInput.value);
        composeInput.value = '';
        updateButtonState(composeInput, composeButton);
        showToast('Your flitt was posted!');
    }
});

// Tabs functionality
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
    });
});

// Flitt actions (like, reflitt, reply)
likeButtons.forEach(button => {
    button.addEventListener('click', () => {
        toggleLike(button);
    });
});

reflittButtons.forEach(button => {
    button.addEventListener('click', () => {
        toggleReflitt(button);
    });
});

replyButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        toggleComments(index);
    });
});

// Comment input functionality
commentInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
        updateButtonState(input, commentButtons[index]);
    });
});

// Comment button click
commentButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const input = commentInputs[index];
        if (input.value.trim()) {
            const flitt = document.querySelectorAll('.flitt')[Math.floor(index / 2)];
            addComment(flitt, input.value);
            input.value = '';
            updateButtonState(input, button);
        }
    });
});

// Comment like functionality
commentLikeButtons.forEach(button => {
    button.addEventListener('click', () => {
        toggleCommentLike(button);
    });
});

// Dark mode toggle
modeToggle.addEventListener('click', toggleDarkMode);

// Flitter button (compose new flitt)
flitterBtn.addEventListener('click', toggleModal);

// Modal events
closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

modalInput.addEventListener('input', () => {
    updateButtonState(modalInput, modalPostBtn);
});

modalPostBtn.addEventListener('click', () => {
    if (modalInput.value.trim()) {
        createFlitt(modalInput.value);
        modalInput.value = '';
        updateButtonState(modalInput, modalPostBtn);
        modal.style.display = 'none';
        showToast('Your flitt was posted!');
    }
});

// Follow button functionality
followButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.textContent === 'Follow') {
            button.textContent = 'Following';
            button.style.backgroundColor = 'var(--primary-color)';
            showToast('You are now following this account!');
        } else {
            button.textContent = 'Follow';
            button.style.backgroundColor = 'var(--text-color)';
        }
    });
});

// Close toast on click
toast.addEventListener('click', () => {
    toast.classList.remove('show');
});

// Initialize mobile navigation items
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');
mobileNavItems.forEach(item => {
    item.addEventListener('click', () => {
        mobileNavItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
    });
});

// Infininte scroll simulation
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    
    if (scrollTop + clientHeight >= scrollHeight - 5) {
        // Show loading animation
        document.querySelector('.loading-dots').style.display = 'flex';
        
        // Simulate loading more posts after delay
        setTimeout(() => {
            // Hide loading animation
            document.querySelector('.loading-dots').style.display = 'none';
            
            // Add more flitts
            for (let i = 0; i < 2; i++) {
                const randomContent = [
                    "Just learned a new recipe today! #cooking",
                    "The weather is amazing today! Going for a hike.",
                    "Has anyone seen the latest movie? Worth watching?",
                    "Working on a new project. Can't wait to share!",
                    "Just finished reading an amazing book. Highly recommend!",
                    "Coffee time! ☕ Best part of the morning.",
                    "Monday motivation: You got this! #MondayMotivation",
                    "Throwback to last summer's vacation #TBT",
                    "New tech gadget arrived today! So excited to try it out.",
                    "Looking for recommendations for a good podcast. Any suggestions?"
                ];
                
                const randomIndex = Math.floor(Math.random() * randomContent.length);
                createFlitt(randomContent[randomIndex]);
            }
        }, 1500);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check for saved dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const profilePreview = document.querySelector('.profile-preview');
    const logoutMenu = document.querySelector('.logout-menu');
    
    // Toggle logout menu when clicking on the profile preview
    profilePreview.addEventListener('click', (e) => {
      e.stopPropagation();
      
      // Toggle the menu visibility
      if (logoutMenu.style.display === 'block') {
        logoutMenu.style.display = 'none';
      } else {
        logoutMenu.style.display = 'block';
      }
    });
    
    // Close logout menu when clicking outside
    document.addEventListener('click', () => {
      logoutMenu.style.display = 'none';
    });
    
    // Prevent clicks inside the logout menu from closing it
    logoutMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
    // Logout functionality
    const logoutButton = document.querySelector('.logout-button');
    
  });