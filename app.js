// MindWell AI-Powered Mental Wellness Platform
class MindWellApp {
    constructor() {
        this.currentSection = 'home';
        this.dailyTipIndex = 0;
        this.breathingTimer = null;
        this.groundingStep = 5;
        this.conversationHistory = [];
        this.isTyping = false;
        
        this.breathingState = {
            isActive: false,
            currentPhase: 'inhale',
            currentRound: 0,
            totalRounds: 5,
            currentExercise: null,
            phaseIndex: 0
        };

        // Comprehensive data from the provided JSON
        this.data = {
            crisisKeywords: [
                'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 'self-harm',
                'cutting', 'overdose', 'want to die', 'no point living', 'better off dead',
                'harm myself', 'end my life', 'cant go on', 'worthless', 'no hope'
            ],
            warningKeywords: [
                'hopeless', 'worthless', 'trapped', 'burden', 'alone', 'desperate',
                'exhausted', 'empty', 'overwhelmed', 'cant cope', 'give up', 'useless'
            ],
            crisisHelplines: [
                {
                    name: "988 Suicide & Crisis Lifeline",
                    number: "988",
                    description: "24/7 confidential support - Call or text",
                    region: "US",
                    type: "call_text",
                    priority: 1
                },
                {
                    name: "Crisis Text Line",
                    number: "741741",
                    description: "Text HOME to 741741 - Anonymous crisis counseling",
                    region: "US", 
                    type: "text",
                    priority: 2
                },
                {
                    name: "Tele-MANAS",
                    number: "14416",
                    description: "Mental health support, Government helpline",
                    region: "India",
                    type: "call",
                    priority: 1
                },
                {
                    name: "KIRAN Mental Health", 
                    number: "1800-599-0019",
                    description: "24/7 support in 13 languages",
                    region: "India",
                    type: "call",
                    priority: 1
                },
                {
                    name: "Vandrevala Foundation",
                    number: "9999666555", 
                    description: "Crisis intervention, WhatsApp available",
                    region: "India",
                    type: "call_whatsapp",
                    priority: 2
                },
                {
                    name: "AASRA",
                    number: "9820466728",
                    description: "Emotional support & counselling",
                    region: "India", 
                    type: "call",
                    priority: 3
                },
                {
                    name: "One Life",
                    number: "78930-78930",
                    description: "Suicide prevention & crisis support", 
                    region: "India",
                    type: "call",
                    priority: 2
                },
                {
                    name: "Mann Talks",
                    number: "8686139139",
                    description: "Counselling support",
                    region: "India",
                    type: "call", 
                    priority: 3
                }
            ],
            breathingExercises: [
                {
                    id: "box-breathing",
                    name: "Box Breathing",
                    description: "Breathe in for 4, hold for 4, exhale for 4, hold for 4",
                    phases: ["Breathe In", "Hold", "Breathe Out", "Hold"],
                    timings: [4, 4, 4, 4],
                    totalDuration: 300,
                    difficulty: "beginner",
                    benefits: ["Reduces anxiety", "Improves focus", "Calms nervous system"]
                },
                {
                    id: "belly-breathing", 
                    name: "Belly Breathing",
                    description: "Deep breathing focusing on stomach expansion",
                    phases: ["Breathe In Slowly", "Hold Gently", "Breathe Out Slowly"],
                    timings: [4, 7, 8],
                    totalDuration: 240,
                    difficulty: "beginner",
                    benefits: ["Promotes relaxation", "Reduces stress", "Improves oxygen flow"]
                },
                {
                    id: "finger-breathing",
                    name: "5-Finger Breathing", 
                    description: "Trace your hand while breathing",
                    phases: ["Trace Up (Inhale)", "Trace Down (Exhale)"],
                    timings: [5, 5],
                    totalDuration: 180,
                    difficulty: "beginner", 
                    benefits: ["Easy to do anywhere", "Provides focus point", "Calms mind"]
                },
                {
                    id: "flower-candle",
                    name: "Flower and Candle Breathing",
                    description: "Smell the flower, blow out the candle",
                    phases: ["Smell the Flower", "Pause", "Blow Out Candle"],
                    timings: [4, 2, 6],
                    totalDuration: 200,
                    difficulty: "beginner",
                    benefits: ["Child-friendly imagery", "Engaging visualization", "Calming effect"]
                }
            ],
            dailyWellnessTips: [
                {
                    category: "Sleep Hygiene",
                    tip: "Aim for 8-10 hours of sleep each night",
                    details: "Create a consistent bedtime routine and avoid screens 1 hour before sleep"
                },
                {
                    category: "Regular Exercise",
                    tip: "Get 20-30 minutes of physical activity daily",
                    details: "Find activities you enjoy - walking, dancing, sports, or yoga"
                },
                {
                    category: "Balanced Nutrition",
                    tip: "Eat regular meals and stay hydrated",
                    details: "Include fruits and vegetables, limit caffeine, especially in the evening"
                },
                {
                    category: "Social Connection",
                    tip: "Spend quality time with people you care about",
                    details: "Face-to-face interactions are especially beneficial for mental health"
                },
                {
                    category: "Mindfulness Practice",
                    tip: "Practice being present in the moment",
                    details: "Start with 5 minutes of mindfulness or gratitude practice daily"
                },
                {
                    category: "Creative Expression",
                    tip: "Express emotions through creativity",
                    details: "Try art, music, writing, or any creative outlet that feels good"
                }
            ],
            moodResponses: {
                great: "That's wonderful! Keep up the positive momentum. Consider sharing your joy with others - it can help them feel better too. What's been going particularly well for you?",
                good: "It's great that you're feeling good today. Take a moment to appreciate what's going well in your life. Would you like some tips to maintain this positive mood?",
                okay: "It's perfectly normal to have okay days. Everyone experiences ups and downs. Would you like to try a breathing exercise or talk about what might help you feel a bit better?",
                struggling: "Thank you for being honest about how you're feeling. It takes courage to acknowledge when things are difficult. You're not alone in this. Would you like to explore some coping strategies or talk about what's been challenging?",
                crisis: "I'm very concerned about what you're experiencing. Your life has value and there are people who want to help you right now. Please reach out for immediate support - you don't have to face this alone."
            },
            chatbotResponses: {
                greeting: [
                    "Hi there! I'm your AI mental wellness companion. I'm here to listen, support you, and help you find resources. How are you feeling today?",
                    "Hello! It's good to see you here. I'm designed to provide empathetic support and helpful resources. What's on your mind right now?", 
                    "Welcome! I'm glad you decided to chat with me. I'm here to support your mental wellness journey. How can I help you today?"
                ],
                crisis: [
                    "I'm very concerned about what you're sharing. Your life has value and there are people who want to help you right now. Please reach out for immediate support:",
                    "What you're going through sounds incredibly difficult, but you don't have to face this alone. Help is available right now:",
                    "I hear that you're in a lot of pain. There are people trained to help with exactly what you're experiencing. Please contact:"
                ],
                supportive: [
                    "That sounds really challenging. It takes courage to share what you're going through, and I want you to know that your feelings are completely valid.",
                    "I hear you, and what you're experiencing is real and important. It's understandable that you're struggling with this.",
                    "Thank you for trusting me with this. Your feelings matter, and it's okay to not be okay sometimes.",
                    "It sounds like you're dealing with a lot right now. That must feel overwhelming, and it makes sense that you're reaching out for support."
                ],
                coping_suggestions: [
                    "Would you like to try a breathing exercise together? It might help you feel a bit calmer right now.",
                    "Sometimes grounding techniques can help when we feel overwhelmed. I can guide you through a 5-4-3-2-1 exercise if you'd like.",
                    "Taking care of yourself during difficult times is so important. What usually helps you feel even a little bit better?",
                    "Let's focus on some things that might help you cope with these feelings. Are you interested in trying a mindfulness exercise?"
                ],
                professional_help: [
                    "It sounds like talking to a counselor or therapist could be really helpful for what you're going through. They have specialized training to support you.",
                    "Have you considered reaching out to a mental health professional? They can offer tools and support specifically designed for what you're experiencing.",
                    "Sometimes we need more support than friends and family can provide, and that's completely okay. A therapist could offer you additional guidance.",
                    "There are people trained specifically to help with these kinds of feelings and situations. Would you like some information about how to find professional help?"
                ],
                encouragement: [
                    "You're stronger than you think, and taking this step to seek support shows real courage.",
                    "Every small step you take toward caring for your mental health matters. You're doing something important by being here.",
                    "Recovery and healing take time, and that's completely normal. Be patient and kind with yourself.",
                    "You deserve support, kindness, and care. Don't let anyone tell you otherwise."
                ]
            },
            positiveAffirmations: [
                "You are stronger than you think",
                "This feeling will pass", 
                "You deserve kindness and support",
                "It's okay to ask for help",
                "Your feelings are valid",
                "You have the power to overcome challenges",
                "Every small step forward counts",
                "You are not alone in this journey",
                "You are worthy of love and care",
                "Healing takes time and that's okay",
                "Your mental health matters",
                "You can get through this difficult time"
            ]
        };

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
                this.initializeDailyTip();
                this.loadProgress();
                this.initializeChatbot();
            });
        } else {
            this.bindEvents();
            this.initializeDailyTip();
            this.loadProgress();
            this.initializeChatbot();
        }
    }

    bindEvents() {
        // Navigation events
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', this.toggleMobileNav.bind(this));
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        // Crisis access buttons
        const crisisQuickAccess = document.getElementById('crisisQuickAccess');
        if (crisisQuickAccess) {
            crisisQuickAccess.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('crisis');
            });
        }

        const viewAllCrisis = document.getElementById('viewAllCrisis');
        if (viewAllCrisis) {
            viewAllCrisis.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToSection('crisis');
            });
        }

        // AI Chatbot events
        const chatbotToggle = document.getElementById('chatbotToggle');
        const startChatBtn = document.getElementById('startChatBtn');
        const quickChat = document.getElementById('quickChat');
        const footerChatBtn = document.getElementById('footerChatBtn');
        
        [chatbotToggle, startChatBtn, quickChat, footerChatBtn].forEach(btn => {
            if (btn) {
                btn.addEventListener('click', this.openChatbot.bind(this));
            }
        });

        const chatbotClose = document.getElementById('chatbotClose');
        if (chatbotClose) {
            chatbotClose.addEventListener('click', this.closeChatbot.bind(this));
        }

        const sendButton = document.getElementById('sendButton');
        if (sendButton) {
            sendButton.addEventListener('click', this.sendMessage.bind(this));
        }

        const chatbotInput = document.getElementById('chatbotInput');
        if (chatbotInput) {
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            chatbotInput.addEventListener('input', this.autoResizeTextarea.bind(this));
        }

        // Navigation cards
        document.querySelectorAll('.nav-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });

        // Quick tools
        const quickBreathing = document.getElementById('quickBreathing');
        if (quickBreathing) {
            quickBreathing.addEventListener('click', () => {
                this.startBreathingExercise({ target: { getAttribute: () => 'box' } });
            });
        }

        const quickGrounding = document.getElementById('quickGrounding');
        if (quickGrounding) {
            quickGrounding.addEventListener('click', () => {
                this.navigateToSection('coping');
                setTimeout(() => {
                    document.getElementById('startGrounding')?.click();
                }, 500);
            });
        }

        const quickMood = document.getElementById('quickMood');
        if (quickMood) {
            quickMood.addEventListener('click', () => {
                document.querySelector('.quick-checkin')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        // Daily tip
        const nextTipBtn = document.getElementById('nextTip');
        if (nextTipBtn) {
            nextTipBtn.addEventListener('click', this.nextDailyTip.bind(this));
        }

        // Mood check-in
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', this.handleMoodSelect.bind(this));
        });

        // Breathing exercises
        document.querySelectorAll('.start-breathing').forEach(btn => {
            btn.addEventListener('click', this.startBreathingExercise.bind(this));
        });

        // Breathing modal controls
        const closeBreathing = document.getElementById('closeBreathing');
        if (closeBreathing) {
            closeBreathing.addEventListener('click', this.closeBreathingModal.bind(this));
        }

        const startBreathingBtn = document.getElementById('startBreathingBtn');
        if (startBreathingBtn) {
            startBreathingBtn.addEventListener('click', this.startBreathingTimer.bind(this));
        }

        const pauseBreathingBtn = document.getElementById('pauseBreathingBtn');
        if (pauseBreathingBtn) {
            pauseBreathingBtn.addEventListener('click', this.pauseBreathingTimer.bind(this));
        }

        const resetBreathingBtn = document.getElementById('resetBreathingBtn');
        if (resetBreathingBtn) {
            resetBreathingBtn.addEventListener('click', this.resetBreathingTimer.bind(this));
        }

        // Grounding exercise
        const startGrounding = document.getElementById('startGrounding');
        if (startGrounding) {
            startGrounding.addEventListener('click', this.startGroundingExercise.bind(this));
        }

        // Habits tracking
        document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', this.updateHabitsProgress.bind(this));
        });

        // Close modals when clicking outside
        const breathingModal = document.getElementById('breathingModal');
        if (breathingModal) {
            breathingModal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.closeBreathingModal();
                }
            });
        }

        const chatbotModal = document.getElementById('chatbotModal');
        if (chatbotModal) {
            chatbotModal.addEventListener('click', (e) => {
                if (e.target === e.currentTarget) {
                    this.closeChatbot();
                }
            });
        }

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    // Navigation Functions
    toggleMobileNav() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
            const section = href.substring(1);
            this.navigateToSection(section);
        }
        
        // Close mobile nav if open
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    navigateToSection(sectionName) {
        // Hide current section
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('section--active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('section--active');
            targetSection.classList.add('fade-in');
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`[href="#${sectionName}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            this.currentSection = sectionName;
            
            // Scroll to top
            window.scrollTo(0, 0);
            
            // Announce to screen readers
            this.announceToScreenReader(`Navigated to ${sectionName} section`);
        }
    }

    // AI Chatbot Functions
    initializeChatbot() {
        // Add initial greeting to conversation history
        this.conversationHistory = [
            {
                type: 'bot',
                message: this.getRandomResponse('greeting'),
                timestamp: new Date()
            }
        ];
    }

    openChatbot() {
        const modal = document.getElementById('chatbotModal');
        if (modal) {
            modal.classList.remove('hidden');
            document.getElementById('chatbotInput')?.focus();
            this.announceToScreenReader('AI chatbot opened');
        }
    }

    closeChatbot() {
        const modal = document.getElementById('chatbotModal');
        if (modal) {
            modal.classList.add('hidden');
            this.announceToScreenReader('AI chatbot closed');
        }
    }

    autoResizeTextarea() {
        const textarea = document.getElementById('chatbotInput');
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    }

    sendMessage() {
        const input = document.getElementById('chatbotInput');
        if (!input || !input.value.trim()) return;

        const message = input.value.trim();
        input.value = '';
        this.autoResizeTextarea();

        // Add user message to conversation
        this.addMessage('user', message);
        
        // Check for crisis keywords
        const isCrisis = this.detectCrisis(message);
        
        if (isCrisis) {
            this.handleCrisisDetection(message);
        } else {
            // Generate AI response
            this.generateAIResponse(message);
        }
    }

    addMessage(type, content) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message slide-up`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'message-time';
        timeDiv.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.appendChild(contentDiv);
        messageDiv.appendChild(timeDiv);
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Add to conversation history
        this.conversationHistory.push({
            type: type,
            message: content,
            timestamp: new Date()
        });
    }

    detectCrisis(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for crisis keywords
        const hasCrisisKeywords = this.data.crisisKeywords.some(keyword => 
            lowerMessage.includes(keyword.toLowerCase())
        );
        
        // Check for warning keywords (multiple warnings might indicate crisis)
        const warningCount = this.data.warningKeywords.filter(keyword => 
            lowerMessage.includes(keyword.toLowerCase())
        ).length;
        
        return hasCrisisKeywords || warningCount >= 3;
    }

    handleCrisisDetection(message) {
        // Show crisis alert
        const crisisAlert = document.getElementById('crisisAlert');
        if (crisisAlert) {
            crisisAlert.classList.remove('hidden');
        }
        
        // Show typing indicator
        this.showTypingIndicator();
        
        setTimeout(() => {
            this.hideTypingIndicator();
            
            // Add crisis response
            const crisisResponse = this.getRandomResponse('crisis');
            this.addMessage('bot', crisisResponse);
            
            // Add helpful follow-up
            setTimeout(() => {
                this.addMessage('bot', "I want to help you find the support you need. You can also try some immediate coping strategies like breathing exercises or grounding techniques. Would you like me to guide you through one?");
            }, 1000);
            
        }, 2000);
        
        this.announceToScreenReader('Crisis keywords detected. Emergency resources displayed.');
    }

    generateAIResponse(message) {
        this.showTypingIndicator();
        
        // Simulate AI processing time
        setTimeout(() => {
            this.hideTypingIndicator();
            
            const response = this.getContextualResponse(message);
            this.addMessage('bot', response);
            
            // Sometimes offer additional resources
            if (Math.random() > 0.7) {
                setTimeout(() => {
                    this.offerAdditionalSupport(message);
                }, 2000);
            }
            
        }, 1500 + Math.random() * 1000);
    }

    getContextualResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Check for specific topics and provide relevant responses
        if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
            return "I hear that you're feeling anxious. Anxiety can be really overwhelming, but there are ways to manage it. Would you like to try a breathing exercise together? Box breathing can be particularly helpful for anxiety.";
        }
        
        if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
            return "I'm sorry you're feeling down. Those feelings are valid and it's important to acknowledge them. Sometimes when we're feeling sad, connecting with others or doing small acts of self-care can help. What usually brings you a bit of comfort?";
        }
        
        if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
            return "Stress and feeling overwhelmed are really common, especially for teens and young adults. It sounds like you're dealing with a lot right now. Breaking things down into smaller, manageable steps can help. What's been causing you the most stress lately?";
        }
        
        if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('insomnia')) {
            return "Sleep problems can really affect how we feel. Good sleep hygiene is so important for mental health. Aim for 8-10 hours, try to avoid screens an hour before bed, and create a calming bedtime routine. What's your current sleep schedule like?";
        }
        
        if (lowerMessage.includes('friend') || lowerMessage.includes('relationship') || lowerMessage.includes('social')) {
            return "Relationships and social connections are so important for our mental health, but they can also be a source of stress sometimes. It sounds like something social is on your mind. Would you like to talk about what's happening with your relationships?";
        }
        
        if (lowerMessage.includes('school') || lowerMessage.includes('grade') || lowerMessage.includes('exam') || lowerMessage.includes('study')) {
            return "School stress is really common and completely understandable. Academic pressure can feel overwhelming sometimes. Remember that grades don't define your worth. Have you tried breaking your study time into smaller chunks with breaks in between?";
        }
        
        // Check for warning keywords for supportive response
        const hasWarningWords = this.data.warningKeywords.some(keyword => 
            lowerMessage.includes(keyword.toLowerCase())
        );
        
        if (hasWarningWords) {
            return this.getRandomResponse('supportive');
        }
        
        // Default supportive responses
        const supportiveResponses = [
            "Thank you for sharing that with me. It sounds like you're going through something challenging. I'm here to listen and support you.",
            "I appreciate you opening up about what's on your mind. Your feelings are important and valid. How can I best support you right now?",
            "It takes courage to talk about difficult things. I'm glad you're here and willing to share. What would be most helpful for you at this moment?",
            "I hear you, and I want you to know that what you're experiencing matters. You don't have to go through this alone. What kind of support are you looking for?"
        ];
        
        return supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)];
    }

    offerAdditionalSupport(message) {
        const suggestions = [
            "Would you like me to share some grounding techniques that might help you feel more centered?",
            "I can guide you through a quick mindfulness exercise if you think that would be helpful.",
            "Would you like to know about some professional resources that might be beneficial for what you're going through?",
            "Sometimes breathing exercises can help when we're feeling stressed. Would you like to try one together?",
            "Would you like me to share some daily wellness tips that might help improve how you're feeling overall?"
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        this.addMessage('bot', randomSuggestion);
    }

    getRandomResponse(category) {
        const responses = this.data.chatbotResponses[category];
        if (responses && responses.length > 0) {
            return responses[Math.floor(Math.random() * responses.length)];
        }
        return "I'm here to support you. How can I help you today?";
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            this.isTyping = true;
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.add('hidden');
            this.isTyping = false;
        }
    }

    // Daily Tip Functions
    initializeDailyTip() {
        this.updateDailyTip();
    }

    nextDailyTip() {
        this.dailyTipIndex = (this.dailyTipIndex + 1) % this.data.dailyWellnessTips.length;
        this.updateDailyTip();
        this.announceToScreenReader('Daily tip updated');
    }

    updateDailyTip() {
        const tip = this.data.dailyWellnessTips[this.dailyTipIndex];
        const categoryEl = document.getElementById('tipCategory');
        const textEl = document.getElementById('tipText');
        const detailsEl = document.getElementById('tipDetails');
        
        if (categoryEl && textEl && detailsEl) {
            categoryEl.textContent = tip.category;
            textEl.textContent = tip.tip;
            detailsEl.textContent = tip.details;
        }
    }

    // Mood Check-in Functions
    handleMoodSelect(e) {
        const mood = e.target.getAttribute('data-mood');
        
        // Update button states
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        e.target.classList.add('selected');
        
        // Show response
        const responseDiv = document.getElementById('moodResponse');
        const responseText = document.getElementById('moodText');
        
        if (responseDiv && responseText) {
            responseText.textContent = this.data.moodResponses[mood];
            responseDiv.classList.remove('hidden');
            
            // Announce to screen readers
            this.announceToScreenReader(this.data.moodResponses[mood]);
        }
        
        // If crisis mood, highlight crisis resources and suggest AI chat
        if (mood === 'crisis') {
            this.showToast('I\'m concerned about you. Please consider reaching out for immediate support.');
            setTimeout(() => {
                if (confirm('Would you like to chat with our AI companion for immediate support?')) {
                    this.openChatbot();
                    setTimeout(() => {
                        this.addMessage('bot', 'I noticed you indicated you\'re in crisis. I\'m here to support you. Your life has value and help is available. Would you like me to share some immediate resources?');
                    }, 500);
                } else {
                    this.navigateToSection('crisis');
                }
            }, 2000);
        }
        
        // Track mood for insights
        this.trackMood(mood);
    }

    trackMood(mood) {
        // In a real application, this would save to a backend
        const today = new Date().toDateString();
        const moodData = JSON.parse(localStorage.getItem('moodTracker') || '{}');
        moodData[today] = mood;
        localStorage.setItem('moodTracker', JSON.stringify(moodData));
    }

    // Breathing Exercise Functions
    startBreathingExercise(e) {
        const exerciseType = e.target.getAttribute('data-exercise');
        const exercise = this.data.breathingExercises.find(ex => 
            ex.id === `${exerciseType}-breathing` || ex.name.toLowerCase().includes(exerciseType)
        );
        
        if (exercise) {
            this.breathingState.currentExercise = exercise;
            const titleEl = document.getElementById('exerciseTitle');
            const modal = document.getElementById('breathingModal');
            
            if (titleEl && modal) {
                titleEl.textContent = exercise.name;
                modal.classList.remove('hidden');
                this.resetBreathingTimer();
                this.announceToScreenReader(`${exercise.name} exercise opened`);
            }
        }
    }

    closeBreathingModal() {
        const modal = document.getElementById('breathingModal');
        if (modal) {
            modal.classList.add('hidden');
            this.pauseBreathingTimer();
            this.resetBreathingTimer();
            this.announceToScreenReader('Breathing exercise closed');
        }
    }

    startBreathingTimer() {
        if (this.breathingState.isActive) return;
        
        this.breathingState.isActive = true;
        this.breathingState.currentRound = 1;
        this.breathingState.phaseIndex = 0;
        
        this.updateBreathingDisplay();
        this.runBreathingCycle();
        this.announceToScreenReader('Breathing exercise started');
    }

    pauseBreathingTimer() {
        this.breathingState.isActive = false;
        if (this.breathingTimer) {
            clearTimeout(this.breathingTimer);
            this.breathingTimer = null;
        }
        this.announceToScreenReader('Breathing exercise paused');
    }

    resetBreathingTimer() {
        this.pauseBreathingTimer();
        this.breathingState.currentRound = 0;
        this.breathingState.phaseIndex = 0;
        
        const roundEl = document.getElementById('breathingRound');
        const instructionEl = document.getElementById('breathingInstruction');
        const circleEl = document.getElementById('breathingCircle');
        const countEl = document.getElementById('breathingCount');
        
        if (roundEl) roundEl.textContent = '0';
        if (instructionEl) instructionEl.textContent = 'Get Ready...';
        if (circleEl) circleEl.classList.remove('expand');
        if (countEl) countEl.textContent = '';
        
        // Reset progress dots
        document.querySelectorAll('.progress-dots .dot').forEach(dot => {
            dot.classList.remove('active');
        });
    }

    runBreathingCycle() {
        if (!this.breathingState.isActive || this.breathingState.currentRound > this.breathingState.totalRounds) {
            this.completeBreathingExercise();
            return;
        }

        const exercise = this.breathingState.currentExercise;
        if (!exercise) return;

        const phases = exercise.phases;
        const timings = exercise.timings;
        
        this.runBreathingPhase(phases, timings, 0);
    }

    runBreathingPhase(phases, timings, phaseIndex) {
        if (!this.breathingState.isActive) return;
        
        if (phaseIndex >= phases.length) {
            // Complete this round
            this.breathingState.currentRound++;
            this.updateBreathingDisplay();
            this.runBreathingCycle();
            return;
        }

        const phase = phases[phaseIndex];
        const duration = timings[phaseIndex] * 1000;
        
        const instructionEl = document.getElementById('breathingInstruction');
        const circleEl = document.getElementById('breathingCircle');
        const countEl = document.getElementById('breathingCount');
        
        if (instructionEl) {
            instructionEl.textContent = phase;
        }
        
        // Visual feedback
        if (circleEl) {
            if (phase.toLowerCase().includes('in') || phase.toLowerCase().includes('inhale')) {
                circleEl.classList.add('expand');
            } else if (phase.toLowerCase().includes('out') || phase.toLowerCase().includes('exhale')) {
                circleEl.classList.remove('expand');
            }
        }
        
        // Countdown
        if (countEl) {
            let count = timings[phaseIndex];
            countEl.textContent = count;
            
            const countdown = setInterval(() => {
                count--;
                if (count > 0) {
                    countEl.textContent = count;
                } else {
                    clearInterval(countdown);
                    countEl.textContent = '';
                }
            }, 1000);
        }
        
        this.breathingTimer = setTimeout(() => {
            this.runBreathingPhase(phases, timings, phaseIndex + 1);
        }, duration);
    }

    updateBreathingDisplay() {
        const roundEl = document.getElementById('breathingRound');
        if (roundEl) {
            roundEl.textContent = this.breathingState.currentRound;
        }
        
        // Update progress dots
        const dots = document.querySelectorAll('.progress-dots .dot');
        dots.forEach((dot, index) => {
            if (index < this.breathingState.currentRound) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    completeBreathingExercise() {
        this.breathingState.isActive = false;
        const instructionEl = document.getElementById('breathingInstruction');
        if (instructionEl) {
            instructionEl.textContent = 'Great job! Exercise complete.';
        }
        
        this.announceToScreenReader('Breathing exercise completed successfully');
        this.showToast('Breathing exercise completed! Well done.');
        
        setTimeout(() => {
            this.closeBreathingModal();
        }, 3000);
    }

    // Grounding Exercise Functions
    startGroundingExercise() {
        const exerciseDiv = document.getElementById('groundingExercise');
        if (exerciseDiv) {
            exerciseDiv.classList.remove('hidden');
            this.groundingStep = 5;
            this.showGroundingStep();
            this.announceToScreenReader('5-4-3-2-1 grounding exercise started');
        }
    }

    showGroundingStep() {
        // Hide all steps
        document.querySelectorAll('.grounding-step').forEach(step => {
            step.classList.remove('active');
        });
        
        // Show current step
        const currentStep = document.getElementById(`step${this.groundingStep}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
    }

    // Global function for grounding navigation
    nextGroundingStep() {
        if (this.groundingStep > 1) {
            this.groundingStep--;
            this.showGroundingStep();
        }
    }

    completeGrounding() {
        const exerciseDiv = document.getElementById('groundingExercise');
        if (exerciseDiv) {
            exerciseDiv.classList.add('hidden');
        }
        this.showToast('Grounding exercise completed! How do you feel?');
        this.announceToScreenReader('Grounding exercise completed');
    }

    // Habits Tracking Functions
    updateHabitsProgress() {
        const checkboxes = document.querySelectorAll('.habit-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        const totalCount = checkboxes.length;
        const percentage = (checkedCount / totalCount) * 100;
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');
        
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            if (percentage === 100) {
                progressText.textContent = '🎉 Amazing! You\'ve completed all your wellness activities today!';
                progressText.style.color = 'var(--color-success)';
            } else if (percentage >= 75) {
                progressText.textContent = `Great progress! ${checkedCount}/${totalCount} activities completed.`;
                progressText.style.color = 'var(--color-success)';
            } else if (percentage >= 50) {
                progressText.textContent = `Good work! ${checkedCount}/${totalCount} activities completed.`;
                progressText.style.color = 'var(--color-primary)';
            } else {
                progressText.textContent = `${checkedCount}/${totalCount} activities completed. Keep going!`;
                progressText.style.color = 'var(--color-text-secondary)';
            }
        }
        
        // Save progress
        this.saveHabitsProgress(checkboxes);
        
        // Provide encouraging feedback
        if (percentage === 100) {
            this.showToast('🎉 Amazing! You\'ve completed all your daily wellness habits!');
        } else if (checkedCount > 0 && checkedCount % 2 === 0) {
            this.showToast('Great progress on your wellness journey!');
        }
    }

    saveHabitsProgress(checkboxes) {
        const today = new Date().toDateString();
        const progress = Array.from(checkboxes).map(cb => cb.checked);
        const habitsData = JSON.parse(localStorage.getItem('habitsTracker') || '{}');
        habitsData[today] = progress;
        localStorage.setItem('habitsTracker', JSON.stringify(habitsData));
    }

    loadProgress() {
        // Load habits progress
        const today = new Date().toDateString();
        const habitsData = JSON.parse(localStorage.getItem('habitsTracker') || '{}');
        const todayProgress = habitsData[today];
        
        if (todayProgress) {
            const checkboxes = document.querySelectorAll('.habit-checkbox');
            checkboxes.forEach((cb, index) => {
                if (todayProgress[index] !== undefined) {
                    cb.checked = todayProgress[index];
                }
            });
            this.updateHabitsProgress();
        }
    }

    // Utility Functions
    showToast(message, type = 'success') {
        // Remove existing toasts
        document.querySelectorAll('.toast').forEach(toast => {
            toast.remove();
        });
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-${type === 'success' ? 'success' : 'error'});
            color: var(--color-btn-primary-text);
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            max-width: 350px;
            animation: slideIn 0.3s ease-out;
            font-weight: 500;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 4000);
    }

    handleKeydown(e) {
        // Handle keyboard navigation
        if (e.key === 'Escape') {
            // Close any open modals
            document.querySelectorAll('.modal').forEach(modal => {
                if (!modal.classList.contains('hidden')) {
                    modal.classList.add('hidden');
                }
            });
            
            // Close mobile nav
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
            
            // Close chatbot
            this.closeChatbot();
        }
        
        // Quick navigation with number keys
        if (e.ctrlKey || e.metaKey) {
            const sectionMap = {
                '1': 'home',
                '2': 'crisis',
                '3': 'wellness',
                '4': 'coping',
                '5': 'professional',
                '6': 'about'
            };
            
            if (sectionMap[e.key]) {
                e.preventDefault();
                this.navigateToSection(sectionMap[e.key]);
            }
        }
        
        // Quick access to chatbot
        if (e.key === 'c' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            this.openChatbot();
        }
    }

    // Accessibility helpers
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    // Analytics and insights (for future enhancement)
    getWellnessInsights() {
        const moodData = JSON.parse(localStorage.getItem('moodTracker') || '{}');
        const habitsData = JSON.parse(localStorage.getItem('habitsTracker') || '{}');
        
        // This would provide insights about mood patterns and habit completion
        // For now, it's a placeholder for future development
        return {
            moodTrends: moodData,
            habitCompletion: habitsData,
            conversationCount: this.conversationHistory.length
        };
    }
}

// Global functions for template access
function nextGroundingStep() {
    if (window.mindWellApp) {
        window.mindWellApp.nextGroundingStep();
    }
}

function completeGrounding() {
    if (window.mindWellApp) {
        window.mindWellApp.completeGrounding();
    }
}

// Emergency contact functions
function callEmergency(number) {
    window.location.href = `tel:${number}`;
    
    // Log for analytics
    if (window.mindWellApp) {
        window.mindWellApp.announceToScreenReader(`Calling emergency number ${number}`);
    }
}

function textCrisisLine(number, message = 'HOME') {
    window.location.href = `sms:${number}?body=${encodeURIComponent(message)}`;
    
    // Log for analytics
    if (window.mindWellApp) {
        window.mindWellApp.announceToScreenReader(`Texting crisis line ${number}`);
    }
}

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    @keyframes breathingExpand {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .breathing-animation {
        animation: breathingExpand 4s ease-in-out infinite;
    }
`;
document.head.appendChild(style);

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new MindWellApp();
    
    // Make app globally accessible
    window.mindWellApp = app;
    
    // Add service worker registration for PWA functionality (future enhancement)
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            console.log('Service worker support detected - PWA ready');
        });
    }
    
    // Add performance monitoring
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`MindWell app loaded in ${Math.round(loadTime)}ms`);
    });
    
    // Show welcome message after a short delay
    setTimeout(() => {
        if (window.location.hash === '' || window.location.hash === '#home') {
            app.showToast('Welcome to MindWell! Click the AI Support button anytime for help. 🤖');
        }
    }, 2000);
});

// Add global error handling
window.addEventListener('error', (e) => {
    console.error('MindWell application error:', e.error);
    
    // In production, this would send error reports to a logging service
    if (window.mindWellApp) {
        window.mindWellApp.showToast('Something went wrong. Please refresh the page if problems persist.', 'error');
    }
});

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Offline support
window.addEventListener('online', () => {
    if (window.mindWellApp) {
        window.mindWellApp.showToast('Connection restored! 🌐');
    }
});

window.addEventListener('offline', () => {
    if (window.mindWellApp) {
        window.mindWellApp.showToast('You\'re offline, but you can still use most features! 📱', 'info');
    }
});

// Export for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MindWellApp;
}