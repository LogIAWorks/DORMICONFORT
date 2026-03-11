/**
 * DORMICONFORT Smart Chatbot
 * Injects a floating chat window and uses Supabase to answer questions.
 */

document.addEventListener('DOMContentLoaded', () => {
    const _URL = 'https://qjkgrtsepfqkixebktbv.supabase.co';
    const _KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqa2dydHNlcGZxa2l4ZWJrdGJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM2MTUsImV4cCI6MjA4ODU2OTYxNX0.SmsQGDNo9GsPWLOFPI1hoaGQswEzhPEjC_9U7FKKLO4';

    let supabase;
    let productsList = [];

    // 1. Inject HTML Structure
    const chatHTML = `
        <div id="dormi-chat-widget" class="dormi-chat-widget">
            <button id="dormi-chat-btn" class="dormi-chat-btn">
                <i class="fas fa-comment-dots"></i>
            </button>
            <div id="dormi-chat-window" class="dormi-chat-window hidden">
                <div class="dormi-chat-header">
                    <div>
                        <h4 style="margin:0; font-family:'Outfit',sans-serif; display:flex; align-items:center; gap:8px;">
                            <span class="filled-d" style="font-size: 0.8em; transform: translateY(-1px);">D</span> IA Asistente
                        </h4>
                        <small style="opacity:0.8;">Responde al instante</small>
                    </div>
                    <button id="dormi-chat-close" class="dormi-chat-close"><i class="fas fa-times"></i></button>
                </div>
                <div id="dormi-chat-body" class="dormi-chat-body">
                    <div class="chat-msg bot-msg">
                        <div class="msg-bubble">¡Hola! Soy el asistente virtual de DORMICONFORT. ¿En qué te puedo ayudar? Puedes preguntarme por colchones, precios o marcas.</div>
                    </div>
                </div>
                <div class="dormi-chat-footer">
                    <input type="text" id="dormi-chat-input" placeholder="Escribe tu consulta aquí..." autocomplete="off">
                    <button id="dormi-chat-send"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);

    async function initChat() {
        if (!window.supabase) {
            setTimeout(initChat, 50);
            return;
        }

        supabase = window.supabase.createClient(_URL, _KEY);

        // WhatsApp Widget (premium)
        const waHTML = `
            <div id="whatsapp-widget" class="whatsapp-widget">
                <a href="https://wa.me/34657557449" target="_blank" rel="noopener noreferrer" class="whatsapp-btn whatsapp-premium-widget">
                    <i class="fab fa-whatsapp"></i>
                    <span class="wa-tooltip">¿Te ayudamos?</span>
                </a>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', waHTML);
    }

    // Run init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initChat);
    } else {
        initChat();
    }

    // 2. DOM Elements
    const chatBtn = document.getElementById('dormi-chat-btn');
    const chatWindow = document.getElementById('dormi-chat-window');
    const chatClose = document.getElementById('dormi-chat-close');
    const chatBody = document.getElementById('dormi-chat-body');
    const chatInput = document.getElementById('dormi-chat-input');
    const chatSend = document.getElementById('dormi-chat-send');

    // 3. UI Events
    if (chatBtn) {
        chatBtn.addEventListener('click', async () => {
            chatWindow.classList.remove('hidden');
            chatWindow.classList.add('visible');
            chatBtn.style.transform = 'scale(0)';
            setTimeout(() => chatInput.focus(), 300);

            // Lazy load products when opening chat
            if (productsList.length === 0) {
                await fetchProductsForChat();
            }
        });
    }

    if (chatClose) {
        chatClose.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
            chatWindow.classList.add('hidden');
            chatBtn.style.transform = 'scale(1)';
        });
    }

    async function fetchProductsForChat() {
        if (!supabase) return;
        try {
            const { data, error } = await supabase.from('products').select('*');
            if (!error) productsList = data || [];
        } catch (e) {
            console.error('Chat products fetch error:', e);
        }
    }

    // 4. Chat Logic
    const addMessage = (text, isBot = false, isHtml = false) => {
        if (!chatBody) return;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg ${isBot ? 'bot-msg' : 'user-msg'}`;

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';
        if (isHtml) {
            bubble.innerHTML = text;
        } else {
            bubble.textContent = text;
        }

        msgDiv.appendChild(bubble);
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    const handleUserMessage = () => {
        if (!chatInput) return;
        const text = chatInput.value.trim();
        if (!text) return;

        // User message
        addMessage(text, false);
        chatInput.value = '';

        // Bot thinking delay
        setTimeout(() => {
            processBotResponse(text);
        }, 600);
    };

    if (chatSend) chatSend.addEventListener('click', handleUserMessage);
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleUserMessage();
        });
    }

    // 5. Smart Bot Brain (Database Search)
    const processBotResponse = async (query) => {
        const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Normalize accents

        // Context Guardrail
        const allowedKeywords = ['colycon', 'colchon', 'cama', 'almohada', 'dormir', 'descanso', 'somier', 'canape', 'base', 'sillon', 'sofa', 'precio', 'barato', 'oferta', 'comprar', 'marca', 'flex', 'marmota', 'ache', 'yecol', 'mash', 'dormilon', 'bilox', 'tienda', 'contacto', 'donde', 'telefono', 'hola', 'buenas', 'dias', 'tarde', 'medida', 'visco', 'muelles', 'ayuda'];

        const words = q.split(/[\s,¿?¡!.]+/);
        // Has context if any word includes the allowed keywords, or if the query is extremely short (like "hi").
        const hasContext = words.some(w => allowedKeywords.some(kw => w && w.includes(kw))) || q.length < 5;

        // Greetings
        if (q.includes('hola') || q.includes('buenos dias') || q.includes('buenas tardes') || q.includes('buenas')) {
            addMessage("¡Hola de nuevo! ¿Qué tipo de descanso estás buscando hoy?", true);
            return;
        }

        // Contact
        if (q.includes('contacto') || q.includes('donde') || q.includes('tienda') || q.includes('telefono') || q.includes('horario')) {
            addMessage("Estamos en **Miguelturra (Ciudad Real)**, en C/ Segadores, 56. Puedes llamarnos al 926 03 91 41 o contactarnos por WhatsApp. ¡Te esperamos!", true, true);
            return;
        }

        // Context check BEFORE DB query to completely reject out-of-context early
        if (!hasContext) {
            addMessage("Lo siento, mi conocimiento está limitado a DORMICONFORT y nuestros productos de descanso, colchones o mobiliario. No soy capaz de responder preguntas que salgan de este contexto.", true);
            return;
        }

        if (productsList.length === 0) {
            await fetchProductsForChat();
            if (productsList.length === 0) {
                addMessage("Lo siento, en este momento no puedo acceder al inventario. Por favor visita nuestro catálogo directamente.", true);
                return;
            }
        }

        // Keywords extraction
        const keywords = words.filter(word => word.length > 3);

        let matches = [];

        // Check for specific categories/intents
        const isOferta = q.includes('oferta') || q.includes('barato') || q.includes('descuento') || q.includes('economico');
        const isCaro = q.includes('caro') || q.includes('mejor') || q.includes('premium') || q.includes('alta gama');

        if (isOferta) {
            matches = productsList.filter(p => p.offer_price != null || (p.price && p.price < 400));
        } else if (isCaro) {
            matches = productsList.filter(p => p.price && p.price > 600);
        } else {
            // By keyword
            matches = productsList.filter(p => {
                const searchString = (p.name + " " + (p.description || "") + " " + (p.category_tags || "")).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return keywords.some(kw => searchString.includes(kw));
            });
        }

        // If no matches with keywords, look for generic terms if category was asked
        if (matches.length === 0) {
            if (q.includes('colchon') || q.includes('cama')) {
                matches = productsList.filter(p => (p.category_tags || '').toLowerCase().includes('colchon'));
            } else if (q.includes('almohada')) {
                matches = productsList.filter(p => (p.category_tags || '').toLowerCase().includes('almohada'));
            } else if (q.includes('canape') || q.includes('base')) {
                matches = productsList.filter(p => (p.category_tags || '').toLowerCase().includes('base'));
            }
        }

        if (matches.length > 0) {
            if (isOferta) matches.sort((a, b) => (a.offer_price || a.price) - (b.offer_price || b.price));

            const topMatches = matches.slice(0, 3);
            let htmlResponse = "He encontrado estas opciones que te podrían encantar:<br><br>";

            topMatches.forEach(p => {
                const priceHtml = p.offer_price
                    ? `<span style="color:#EF4444; font-weight:bold;">${p.offer_price}€</span> <s style="font-size:0.8em; color:#999;">${p.price}€</s>`
                    : `<strong>${p.price}€</strong>`;

                htmlResponse += `
                    <div style="display:flex; gap:10px; margin-bottom:12px; background:white; padding:8px; border-radius:8px; border:1px solid #eee;">
                        <img src="${p.image_url || 'assets/placeholder.png'}" style="width:50px; height:50px; object-fit:cover; border-radius:4px;">
                        <div style="font-size:0.9em;">
                            <strong style="color:var(--primary);">${p.name}</strong><br>
                            ${priceHtml}<br>
                            <span style="font-size:0.8em; color:#666;">${(p.description || "").substring(0, 45)}...</span>
                        </div>
                    </div>
                `;
            });

            htmlResponse += "Puedes ver más en nuestra página de <a href='productos.html' style='color:var(--primary); font-weight:bold;'>Productos</a>.";
            addMessage(htmlResponse, true, true);
        } else {
            // Did not match any specific product despite having some allowed keywords
            addMessage("Hmm, no encuentro un producto exacto para eso en este momento. Puedes probar buscando por marca (ej: Flex, Marmota), tipo (viscoelástico, muelles) o consultar la página de Productos.", true);
        }
    };
});
