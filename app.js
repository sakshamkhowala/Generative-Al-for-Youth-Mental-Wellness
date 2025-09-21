// Advanced Mental Health Chatbot with OpenAI Integration
class MindWellAIApp {
    constructor() {
        this.currentSection = 'home';
        this.dailyTipIndex = 0;
        
        // OpenAI Configuration
        this.openaiConfig = {
            apiUrl: 'https://api.openai.com/v1/chat/completions',
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 300,
            apiKey: null,
            isConfigured: false,
            systemPrompt: `You are MindWell AI, a caring and empathetic mental health support companion specifically designed for young people aged 13-25. Your role is to provide supportive, non-judgmental conversations while maintaining appropriate boundaries.

Your personality:
- Warm, caring, and genuinely interested in the user's wellbeing
- Use natural, conversational language that feels like talking to a supportive friend
- Validate emotions before offering solutions
- Use 'I' statements showing understanding (e.g., 'I can imagine that feels overwhelming')
- Be encouraging but never dismissive of serious concerns

Your approach:
- Always acknowledge and validate the user's feelings first
- Ask follow-up questions that show genuine interest
- Offer evidence-based coping strategies when appropriate
- Encourage professional help for serious concerns
- Use age-appropriate language and references
- Remember context from the conversation naturally

Crisis situations:
- If you detect any mention of self-harm, suicide, or crisis, express genuine concern
- Encourage immediate professional help
- Stay supportive while emphasizing safety
- Provide crisis resources when needed

Boundaries:
- You are a support companion, not a therapist
- Encourage professional help when needed
- Don't provide medical advice
- Focus on emotional support and coping strategies

Respond naturally and conversationally, as if you're a caring friend who has knowledge about mental health support. Keep responses concise but warm (usually 1-3 sentences unless more detail is needed).`
        };

        // Advanced Chatbot State
        this.chatState = {
            isOpen: false,
            conversationHistory: [],
            isProcessing: false,
            retryCount: 0,
            maxRetries: 3,
            currentConversationId: null
        };

        // Crisis Detection
        this.crisisKeywords = [
            'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 'self-harm',
            'cutting', 'overdose', 'want to die', 'no point living', 'better off dead',
            'harm myself', 'end my life', 'cant go on', 'give up on life', 'nothing matters'
        ];

        this.crisisResources = [
            {
                name: "988 Suicide & Crisis Lifeline",
                number: "988",
                description: "24/7 confidential support - Call or text",
                region: "US"
            },
            {
                name: "Crisis Text Line",
                number: "741741", 
                description: "Text HOME to 741741",
                region: "US"
            },
            {
                name: "Tele-MANAS",
                number: "14416",
                description: "Mental health support, Government helpline",
                region: "India"
            },
            {
                name: "KIRAN Mental Health",
                number: "1800-599-0019",
                description: "24/7 support in 13 languages",
                region: "India"
            }
        ];

        // Fallback responses for when API is not available
        this.fallbackResponses = {
            anxiety: "I can hear that anxiety is really weighing on you right now. It sounds like your mind might be racing with worry, which can be so exhausting. Would you like to try a breathing exercise together, or would you prefer to talk about what's making you feel anxious?",
            sadness: "I can feel the heaviness in what you're sharing. That kind of sadness can feel so overwhelming sometimes. It takes courage to reach out when you're feeling this way. What's been contributing to these feelings lately?",
            stress: "It sounds like you're dealing with a lot right now, and that feeling of being overwhelmed makes complete sense. When everything feels like too much, sometimes it helps to focus on just one small thing at a time. What's feeling most urgent for you today?",
            crisis: "I'm really concerned about what you've shared with me. Your safety and wellbeing are incredibly important. Please reach out to a crisis helpline right away - they have trained professionals who can provide the immediate support you need. You don't have to go through this alone.",
            default: "I'm here to listen and support you. It sounds like you're going through something challenging right now. Your feelings are valid, and it's okay to not be okay sometimes. Would you like to share more about what's on your mind, or would you prefer to try some coping techniques together?"
        };

        // Daily wellness tips
        this.dailyWellnessTips = [
            {
                category: "Sleep",
                tip: "Aim for 8-10 hours of sleep each night",
                details: "Create a bedtime routine and avoid screens 1 hour before sleep"
            },
            {
                category: "Exercise",
                tip: "Get 20-30 minutes of physical activity daily",
                details: "Even a short walk or dance session can boost your mood"
            },
            {
                category: "Nutrition",
                tip: "Eat balanced meals and stay hydrated",
                details: "Limit caffeine and sugar, especially in the evening"
            },
            {
                category: "Connection",
                tip: "Spend time with people you care about",
                details: "Face-to-face connection is especially beneficial for mental health"
            },
            {
                category: "Mindfulness",
                tip: "Practice 5 minutes of mindfulness daily",
                details: "Try meditation, deep breathing, or simply being present"
            }
        ];

        this.moodResponses = {
            great: "That's wonderful! Keep up the positive momentum and remember to share your joy with others.",
            good: "It's great that you're feeling good today. Take a moment to appreciate what's going well.",
            okay: "It's perfectly normal to have okay days. Consider trying a breathing exercise or connecting with a friend.",
            struggling: "Thank you for being honest about how you're feeling. Consider reaching out to someone you trust or trying some coping strategies.",
            crisis: "I'm concerned about you. Please reach out for help immediately using our crisis resources. You don't have to go through this alone."
        };

        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupApp();
            });
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        this.loadApiConfiguration();
        this.bindEvents();
        this.initializeDailyTip();
        this.updateUIBasedOnApiStatus();
        console.log('MindWell AI app initialized successfully');
    }

    // API Configuration Management
    loadApiConfiguration() {
        const savedApiKey = sessionStorage.getItem('mindwell_openai_key');
        if (savedApiKey) {
            this.openaiConfig.apiKey = savedApiKey;
            this.openaiConfig.isConfigured = true;
            console.log('API key loaded from session storage');
        } else {
            this.showApiConfigPanel();
        }
    }

    showApiConfigPanel() {
        const overlay = document.getElementById('apiConfigOverlay');
        if (overlay) {
            overlay.classList.remove('hidden');
            
            // Clear previous values and reset state
            const apiKeyInput = document.getElementById('apiKeyInput');
            const saveButton = document.getElementById('saveConfig');
            const statusDiv = document.getElementById('apiStatus');
            
            if (apiKeyInput) apiKeyInput.value = '';
            if (saveButton) saveButton.disabled = true;
            if (statusDiv) {
                statusDiv.className = 'api-status';
                statusDiv.textContent = '';
            }
        }
    }

    hideApiConfigPanel() {
        const overlay = document.getElementById('apiConfigOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    async testApiConnection() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const testButton = document.getElementById('testConnection');
        const saveButton = document.getElementById('saveConfig');
        const statusDiv = document.getElementById('apiStatus');
        const spinner = document.getElementById('testButtonSpinner');
        const buttonText = document.getElementById('testButtonText');

        if (!apiKeyInput || !apiKeyInput.value.trim()) {
            this.showApiStatus('Please enter your OpenAI API key', 'error');
            return;
        }

        const apiKey = apiKeyInput.value.trim();

        // Update UI to show testing state
        testButton.disabled = true;
        spinner.classList.remove('hidden');
        buttonText.textContent = 'Testing...';

        try {
            const response = await fetch(this.openaiConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: this.openaiConfig.model,
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant. Respond with just "Connection successful!" to test the API.'
                        },
                        {
                            role: 'user',
                            content: 'Test connection'
                        }
                    ],
                    max_tokens: 10,
                    temperature: 0.7
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.showApiStatus('✅ API connection successful! You can now save and continue.', 'success');
                saveButton.disabled = false;
                
                // Store temporarily for saving
                this.tempApiKey = apiKey;
            } else {
                const errorData = await response.json().catch(() => ({}));
                let errorMessage = 'API connection failed. ';
                
                if (response.status === 401) {
                    errorMessage += 'Invalid API key. Please check your key and try again.';
                } else if (response.status === 429) {
                    errorMessage += 'Rate limit exceeded. Please try again in a moment.';
                } else if (response.status >= 500) {
                    errorMessage += 'OpenAI service is temporarily unavailable.';
                } else {
                    errorMessage += `Error: ${errorData.error?.message || 'Unknown error'}`;
                }
                
                this.showApiStatus(errorMessage, 'error');
            }
        } catch (error) {
            console.error('API test error:', error);
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                this.showApiStatus('Network error. Please check your internet connection and try again.', 'error');
            } else {
                this.showApiStatus('Connection test failed. Please try again.', 'error');
            }
        } finally {
            // Reset UI
            testButton.disabled = false;
            spinner.classList.add('hidden');
            buttonText.textContent = 'Test Connection';
        }
    }

    saveApiConfiguration() {
        if (this.tempApiKey) {
            sessionStorage.setItem('mindwell_openai_key', this.tempApiKey);
            this.openaiConfig.apiKey = this.tempApiKey;
            this.openaiConfig.isConfigured = true;
            
            this.hideApiConfigPanel();
            this.updateUIBasedOnApiStatus();
            this.showToast('API configured successfully! You can now chat with MindWell AI.');
            
            console.log('API configuration saved successfully');
        }
    }

    showApiStatus(message, type) {
        const statusDiv = document.getElementById('apiStatus');
        if (statusDiv) {
            statusDiv.textContent = message;
            statusDiv.className = `api-status ${type}`;
        }
    }

    updateUIBasedOnApiStatus() {
        const statusIndicator = document.getElementById('apiStatusIndicator');
        const statusMessage = document.getElementById('apiStatusMessage');
        const configureBtn = document.getElementById('configureApiBtn');
        const chatbotStatus = document.getElementById('chatbotStatus');
        const chatbotStatusText = document.getElementById('chatbotStatusText');
        const chatbotToggle = document.getElementById('chatbotToggle');
        const sendButton = document.getElementById('sendButton');
        const chatInput = document.getElementById('chatbotInput');

        if (this.openaiConfig.isConfigured) {
            // API is configured - enable everything
            if (statusIndicator) statusIndicator.className = 'status-indicator-inline online';
            if (statusMessage) statusMessage.textContent = 'AI Ready - Real conversations enabled';
            if (configureBtn) configureBtn.style.display = 'none';
            if (chatbotStatus) chatbotStatus.className = 'status-indicator online';
            if (chatbotStatusText) chatbotStatusText.textContent = 'Ready to chat - AI powered';
            if (chatbotToggle) {
                chatbotToggle.disabled = false;
                chatbotToggle.innerHTML = '💬 Chat with MindWell AI';
            }
            if (sendButton) sendButton.disabled = false;
            if (chatInput) {
                chatInput.disabled = false;
                chatInput.placeholder = 'Share what\'s on your mind... I\'m here to listen';
            }
        } else {
            // API not configured - show offline state
            if (statusIndicator) statusIndicator.className = 'status-indicator-inline offline';
            if (statusMessage) statusMessage.textContent = 'AI Configuration Required';
            if (configureBtn) configureBtn.style.display = 'inline-block';
            if (chatbotStatus) chatbotStatus.className = 'status-indicator offline';
            if (chatbotStatusText) chatbotStatusText.textContent = 'API configuration needed';
            if (chatbotToggle) {
                chatbotToggle.disabled = true;
                chatbotToggle.innerHTML = '⚙️ Configure API First';
            }
            if (sendButton) sendButton.disabled = true;
            if (chatInput) {
                chatInput.disabled = true;
                chatInput.placeholder = 'Configure OpenAI API to start chatting...';
            }
        }
    }

    // Event Binding
    bindEvents() {
        this.bindNavigationEvents();
        this.bindApiConfigEvents();
        this.bindChatbotEvents();
        this.bindOtherEvents();
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    bindApiConfigEvents() {
        const testButton = document.getElementById('testConnection');
        const saveButton = document.getElementById('saveConfig');
        const configureBtn = document.getElementById('configureApiBtn');
        const reconfigureBtn = document.getElementById('reconfigureApi');

        if (testButton) {
            testButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.testApiConnection();
            });
        }

        if (saveButton) {
            saveButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveApiConfiguration();
            });
        }

        if (configureBtn) {
            configureBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.showApiConfigPanel();
            });
        }

        if (reconfigureBtn) {
            reconfigureBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Reconfigure API clicked');
                this.showApiConfigPanel();
            });
        }

        // Close overlay when clicking outside
        const overlay = document.getElementById('apiConfigOverlay');
        if (overlay) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.hideApiConfigPanel();
                }
            });
        }
    }

    bindNavigationEvents() {
        const navToggle = document.getElementById('navToggle');
        if (navToggle) {
            navToggle.addEventListener('click', this.toggleMobileNav.bind(this));
        }

        // Handle all navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Handle API settings button specifically
                if (link.id === 'reconfigureApi') {
                    console.log('Reconfigure API nav link clicked');
                    this.showApiConfigPanel();
                    return;
                }
                
                // Handle regular navigation
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    const section = href.substring(1);
                    console.log('Navigating to section:', section);
                    this.navigateToSection(section);
                }
                
                // Close mobile menu if open
                this.closeMobileNav();
            });
        });

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

        document.querySelectorAll('.nav-card').forEach(card => {
            card.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.getAttribute('data-section');
                if (section) {
                    console.log('Nav card clicked for section:', section);
                    this.navigateToSection(section);
                }
            });
        });
    }

    bindChatbotEvents() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const startChatting = document.getElementById('startChatting');
        
        if (chatbotToggle) {
            chatbotToggle.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.openaiConfig.isConfigured) {
                    this.toggleChatbot();
                } else {
                    this.showApiConfigPanel();
                }
            });
        }
        
        if (startChatting) {
            startChatting.addEventListener('click', (e) => {
                e.preventDefault();
                if (this.openaiConfig.isConfigured) {
                    this.openChatbot();
                } else {
                    this.showApiConfigPanel();
                }
            });
        }

        const chatbotClose = document.getElementById('chatbotClose');
        if (chatbotClose) {
            chatbotClose.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeChatbot();
            });
        }

        const sendButton = document.getElementById('sendButton');
        const chatInput = document.getElementById('chatbotInput');
        
        if (sendButton) {
            sendButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.sendMessage();
            });
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            chatInput.addEventListener('input', this.handleInputChange.bind(this));
        }

        document.querySelectorAll('.quick-reply').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const reply = e.target.getAttribute('data-reply');
                this.sendQuickReply(reply);
            });
        });
    }

    bindOtherEvents() {
        const nextTipBtn = document.getElementById('nextTip');
        if (nextTipBtn) {
            nextTipBtn.addEventListener('click', this.nextDailyTip.bind(this));
        }

        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', this.handleMoodSelect.bind(this));
        });
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

    closeMobileNav() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }

    navigateToSection(sectionName) {
        console.log('Attempting to navigate to:', sectionName);
        
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('section--active');
        });

        // Show target section
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('section--active');
            targetSection.classList.add('fade-in');
            
            // Update navigation active state
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            
            // Find and activate the correct nav link
            const activeLink = document.querySelector(`[href="#${sectionName}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            this.currentSection = sectionName;
            window.scrollTo(0, 0);
            
            console.log('Successfully navigated to:', sectionName);
            this.announceToScreenReader(`Navigated to ${sectionName} section`);
        } else {
            console.error('Section not found:', sectionName);
        }
    }

    // Chatbot Core Functions
    toggleChatbot() {
        if (this.chatState.isOpen) {
            this.closeChatbot();
        } else {
            this.openChatbot();
        }
    }

    openChatbot() {
        const container = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatbotToggle');
        
        if (container && toggle) {
            container.classList.add('active');
            toggle.style.display = 'none';
            this.chatState.isOpen = true;
            
            const input = document.getElementById('chatbotInput');
            if (input) {
                setTimeout(() => input.focus(), 300);
            }
            
            // Show initial greeting if first time
            if (this.chatState.conversationHistory.length === 0) {
                setTimeout(() => {
                    this.showInitialGreeting();
                }, 500);
            }
        }
    }

    closeChatbot() {
        const container = document.getElementById('chatbotContainer');
        const toggle = document.getElementById('chatbotToggle');
        
        if (container && toggle) {
            container.classList.remove('active');
            toggle.style.display = 'block';
            this.chatState.isOpen = false;
        }
    }

    showInitialGreeting() {
        const greetings = [
            "Hi there! I'm MindWell AI, and I'm really glad you're here today. I'm powered by advanced AI technology, which means I can understand and respond to you in a natural, caring way. How has your day been treating you?",
            "Hello! Thanks for reaching out to me today. I'm here as your AI mental health companion, ready to listen and support you through whatever you're experiencing. What's been on your mind lately?",
            "Hey! I'm MindWell AI, and I want you to know that this is a safe space where you can share anything that's weighing on you. As an AI, I'm here 24/7 and completely non-judgmental. How are you feeling right now?"
        ];
        
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        this.addBotMessage(greeting);
    }

    async sendMessage() {
        const input = document.getElementById('chatbotInput');
        if (!input || !this.openaiConfig.isConfigured) return;

        const message = input.value.trim();
        if (!message || this.chatState.isProcessing) return;

        this.addUserMessage(message);
        input.value = '';
        
        this.showTypingIndicator();
        this.chatState.isProcessing = true;
        
        try {
            await this.generateAIResponse(message);
        } catch (error) {
            console.error('Error generating AI response:', error);
            this.handleApiError(error, message);
        } finally {
            this.chatState.isProcessing = false;
            this.hideTypingIndicator();
        }
    }

    sendQuickReply(reply) {
        const input = document.getElementById('chatbotInput');
        if (input) {
            input.value = reply;
            this.sendMessage();
        }
    }

    async generateAIResponse(userMessage) {
        // Check for crisis first
        if (this.detectCrisis(userMessage)) {
            await this.handleCrisisResponse(userMessage);
            return;
        }

        // Build conversation history
        const messages = [
            {
                role: 'system',
                content: this.openaiConfig.systemPrompt
            },
            ...this.chatState.conversationHistory,
            {
                role: 'user',
                content: userMessage
            }
        ];

        // Add current message to history
        this.chatState.conversationHistory.push({
            role: 'user',
            content: userMessage
        });

        // Keep conversation history manageable (last 10 exchanges)
        if (this.chatState.conversationHistory.length > 20) {
            this.chatState.conversationHistory = this.chatState.conversationHistory.slice(-20);
        }

        try {
            const response = await this.callOpenAI(messages);
            const assistantMessage = response.choices[0].message.content;
            
            this.addBotMessage(assistantMessage);
            
            // Add to conversation history
            this.chatState.conversationHistory.push({
                role: 'assistant',
                content: assistantMessage
            });
            
        } catch (error) {
            throw error;
        }
    }

    async callOpenAI(messages, retryCount = 0) {
        try {
            const response = await fetch(this.openaiConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.openaiConfig.apiKey}`
                },
                body: JSON.stringify({
                    model: this.openaiConfig.model,
                    messages: messages,
                    max_tokens: this.openaiConfig.max_tokens,
                    temperature: this.openaiConfig.temperature,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1
                })
            });

            if (!response.ok) {
                if (response.status === 429 && retryCount < this.chatState.maxRetries) {
                    // Rate limited - wait and retry
                    const waitTime = Math.pow(2, retryCount) * 1000; // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                    return this.callOpenAI(messages, retryCount + 1);
                }
                
                throw new Error(`API call failed: ${response.status}`);
            }

            const data = await response.json();
            return data;
            
        } catch (error) {
            if (retryCount < this.chatState.maxRetries && 
                (error.name === 'TypeError' || error.message.includes('network'))) {
                // Network error - retry
                const waitTime = Math.pow(2, retryCount) * 1000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                return this.callOpenAI(messages, retryCount + 1);
            }
            throw error;
        }
    }

    detectCrisis(message) {
        const lowerMessage = message.toLowerCase();
        return this.crisisKeywords.some(keyword => 
            lowerMessage.includes(keyword.toLowerCase())
        );
    }

    async handleCrisisResponse(userMessage) {
        // Add crisis-specific system message
        const crisisMessages = [
            {
                role: 'system',
                content: `${this.openaiConfig.systemPrompt}

IMPORTANT: The user has mentioned something that suggests they may be in crisis or having thoughts of self-harm. You must:
1. Express genuine concern and empathy
2. Emphasize that their life has value
3. Strongly encourage them to reach out to crisis resources immediately
4. Provide specific crisis hotline numbers
5. Stay supportive while emphasizing the importance of professional help
6. Do not try to provide therapy or solve their problems yourself

Remember: This is a crisis situation requiring immediate professional intervention.`
            },
            {
                role: 'user',
                content: userMessage
            }
        ];

        try {
            const response = await this.callOpenAI(crisisMessages);
            const assistantMessage = response.choices[0].message.content;
            
            this.addBotMessage(assistantMessage);
            
            // Add crisis resources
            setTimeout(() => {
                this.addCrisisResources();
            }, 2000);
            
        } catch (error) {
            // Fallback to built-in crisis response
            this.addBotMessage(this.fallbackResponses.crisis);
            setTimeout(() => {
                this.addCrisisResources();
            }, 1500);
        }
    }

    addCrisisResources() {
        let resourcesMessage = "Here are immediate crisis resources:\n\n";
        this.crisisResources.forEach(resource => {
            resourcesMessage += `📞 ${resource.name}: ${resource.number}\n${resource.description}\n\n`;
        });
        resourcesMessage += "Please reach out to one of these resources right away. You don't have to go through this alone. ❤️";
        
        this.addBotMessage(resourcesMessage);
    }

    handleApiError(error, userMessage) {
        console.error('API Error:', error);
        
        let errorMessage;
        let fallbackResponse;
        
        if (error.message.includes('401')) {
            errorMessage = "There seems to be an issue with the API configuration. Please check your API key.";
            fallbackResponse = this.fallbackResponses.default;
        } else if (error.message.includes('429')) {
            errorMessage = "I'm experiencing high demand right now. Let me try to help with a thoughtful response.";
            fallbackResponse = this.getFallbackResponse(userMessage);
        } else if (error.name === 'TypeError' || error.message.includes('network')) {
            errorMessage = "I'm having trouble connecting right now, but I'm still here for you.";
            fallbackResponse = this.getFallbackResponse(userMessage);
        } else {
            errorMessage = "I encountered a technical issue, but let me still try to support you.";
            fallbackResponse = this.getFallbackResponse(userMessage);
        }
        
        this.addBotMessage(`${errorMessage}\n\n${fallbackResponse}`);
    }

    getFallbackResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        
        if (this.detectCrisis(lowerMessage)) {
            return this.fallbackResponses.crisis;
        } else if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
            return this.fallbackResponses.anxiety;
        } else if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
            return this.fallbackResponses.sadness;
        } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
            return this.fallbackResponses.stress;
        } else {
            return this.fallbackResponses.default;
        }
    }

    addUserMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const messageElement = this.createMessageElement(message, 'user');
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    addBotMessage(message) {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (!messagesContainer) return;

        const messageElement = this.createMessageElement(message, 'bot');
        messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }

    createMessageElement(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'bot' ? '🤗' : '👤';

        const content = document.createElement('div');
        content.className = 'message-content';
        
        // Handle multi-line messages
        const lines = message.split('\n');
        lines.forEach((line, index) => {
            if (line.trim()) {
                const p = document.createElement('p');
                p.textContent = line;
                content.appendChild(p);
            } else if (index < lines.length - 1) {
                const br = document.createElement('br');
                content.appendChild(br);
            }
        });

        const timeSmall = document.createElement('small');
        timeSmall.className = 'message-time';
        timeSmall.textContent = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        content.appendChild(timeSmall);

        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);

        return messageDiv;
    }

    showTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.remove('hidden');
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) {
            indicator.classList.add('hidden');
        }
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chatbotMessages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

    handleInputChange() {
        const input = document.getElementById('chatbotInput');
        if (!input) return;
        
        input.style.height = 'auto';
        input.style.height = input.scrollHeight + 'px';
    }

    // Daily Tip Functions
    initializeDailyTip() {
        this.updateDailyTip();
    }

    nextDailyTip() {
        this.dailyTipIndex = (this.dailyTipIndex + 1) % this.dailyWellnessTips.length;
        this.updateDailyTip();
        this.announceToScreenReader('Daily tip updated');
    }

    updateDailyTip() {
        const tip = this.dailyWellnessTips[this.dailyTipIndex];
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
        
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        e.target.classList.add('selected');
        
        const responseDiv = document.getElementById('moodResponse');
        const responseText = document.getElementById('moodText');
        
        if (responseDiv && responseText) {
            responseText.textContent = this.moodResponses[mood];
            responseDiv.classList.remove('hidden');
            this.announceToScreenReader(this.moodResponses[mood]);
        }
        
        if (mood === 'crisis') {
            this.showToast('Opening chat with immediate support...');
            setTimeout(() => {
                if (this.openaiConfig.isConfigured) {
                    this.openChatbot();
                    setTimeout(() => {
                        this.addBotMessage("I'm really concerned about how you're feeling right now. You're incredibly brave for reaching out, and I want you to know that you don't have to go through this alone. Can you tell me a bit more about what's going on? Sometimes just talking about it can help, and I'm here to listen.");
                    }, 1000);
                } else {
                    this.showApiConfigPanel();
                }
            }, 1500);
        }
    }

    // Utility Functions
    showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: var(--color-btn-primary-text);
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            max-width: 300px;
            animation: slideInToast 0.3s ease-out;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutToast 0.3s ease-in forwards';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }

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

    handleKeydown(e) {
        if (e.key === 'Escape') {
            if (this.chatState.isOpen) {
                this.closeChatbot();
            }
            
            const apiOverlay = document.getElementById('apiConfigOverlay');
            if (apiOverlay && !apiOverlay.classList.contains('hidden')) {
                this.hideApiConfigPanel();
            }
            
            this.closeMobileNav();
        }
        
        // Keyboard shortcuts for navigation
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
    }
}

// Toast animations
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInToast {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutToast {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(toastStyles);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing MindWell AI app...');
    const app = new MindWellAIApp();
    window.mindWellApp = app;
    console.log('MindWell AI app initialized and made globally available');
});

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MindWellAIApp;
}