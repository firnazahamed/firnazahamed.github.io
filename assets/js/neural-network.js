// Neural Network Animation JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.neural-network');
    if (!container) return;

    const nodes = [];
    const connections = [];
    
    // Configuration
    const config = {
        particleCount: window.innerWidth > 768 ? 60 : 40,
        nodeCount: window.innerWidth > 768 ? 30 : 20,
        connectionProbability: 0.4,
        activationInterval: 3000,
        maxDistance: window.innerWidth > 768 ? 250 : 180,
        waveAmplitude: 100,
        waveFrequency: 0.01
    };

    // Create flowing wave-like network structure
    function createNodes() {
        const containerRect = container.getBoundingClientRect();
        const width = containerRect.width;
        const height = containerRect.height;
        
        // Create particles (smallest nodes)
        for (let i = 0; i < config.particleCount; i++) {
            const node = document.createElement('div');
            const depth = Math.random();
            const waveOffset = Math.random() * Math.PI * 2;
            
            let className = 'node particle';
            if (depth < 0.3) className += ' depth-3';
            else if (depth < 0.6) className += ' depth-2';
            else if (depth < 0.8) className += ' depth-1';
            
            node.className = className;
            
            // Flowing wave positions
            const baseX = Math.random() * width;
            const baseY = Math.random() * height;
            const waveY = Math.sin(baseX * config.waveFrequency + waveOffset) * config.waveAmplitude;
            
            const x = baseX;
            const y = Math.max(0, Math.min(height, baseY + waveY));
            
            node.style.left = x + 'px';
            node.style.top = y + 'px';
            node.style.animationDelay = Math.random() * 3 + 's';
            
            container.appendChild(node);
            nodes.push({ element: node, x: x, y: y, connections: [], type: 'particle', depth: depth });
        }
        
        // Create main network nodes
        for (let i = 0; i < config.nodeCount; i++) {
            const node = document.createElement('div');
            const size = Math.random();
            const depth = Math.random();
            const waveOffset = Math.random() * Math.PI * 2;
            
            let className = 'node ';
            
            // Size classification
            if (size > 0.9) {
                className += 'star';
            } else if (size > 0.7) {
                className += 'large';
            } else if (size > 0.4) {
                className += 'medium';
            } else {
                className += 'small';
            }
            
            // Depth classification
            if (depth < 0.3) className += ' depth-3';
            else if (depth < 0.6) className += ' depth-2';
            else if (depth < 0.8) className += ' depth-1';
            
            node.className = className;
            
            // Create flowing wave structure
            const flowIndex = i / config.nodeCount;
            const baseX = (flowIndex * width * 1.2) % width;
            const baseY = height * 0.3 + Math.random() * height * 0.4;
            const waveY = Math.sin(baseX * config.waveFrequency + waveOffset) * config.waveAmplitude;
            
            const x = baseX;
            const y = Math.max(0, Math.min(height, baseY + waveY));
            
            node.style.left = x + 'px';
            node.style.top = y + 'px';
            node.style.animationDelay = Math.random() * 3 + 's';
            
            container.appendChild(node);
            nodes.push({ element: node, x: x, y: y, connections: [], type: 'node', depth: depth, size: size });
        }
    }

    // Calculate distance between two points
    function distance(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    // Create connections with depth and intensity variation
    function createConnections() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dist = distance(nodes[i], nodes[j]);
                const nodeA = nodes[i];
                const nodeB = nodes[j];
                
                // Skip connections between particles unless very close
                if (nodeA.type === 'particle' && nodeB.type === 'particle' && dist > 100) continue;
                
                // Increase connection probability for main nodes
                let connectionProb = config.connectionProbability;
                if (nodeA.type === 'node' && nodeB.type === 'node') connectionProb *= 1.5;
                if (nodeA.size > 0.7 || nodeB.size > 0.7) connectionProb *= 1.3;
                
                if (dist < config.maxDistance && Math.random() < connectionProb) {
                    const connection = document.createElement('div');
                    
                    // Determine connection style based on node types and sizes
                    let className = 'connection ';
                    if (nodeA.type === 'particle' || nodeB.type === 'particle') {
                        className += 'thin';
                    } else if ((nodeA.size > 0.7 && nodeB.size > 0.4) || (nodeB.size > 0.7 && nodeA.size > 0.4)) {
                        className += 'thick';
                    } else {
                        className += 'medium';
                    }
                    
                    // Add depth class based on average depth
                    const avgDepth = (nodeA.depth + nodeB.depth) / 2;
                    if (avgDepth < 0.3) className += ' depth-3';
                    else if (avgDepth < 0.6) className += ' depth-2';
                    else if (avgDepth < 0.8) className += ' depth-1';
                    
                    connection.className = className;
                    
                    // Calculate angle and position
                    const angle = Math.atan2(nodeB.y - nodeA.y, nodeB.x - nodeA.x);
                    const length = dist;
                    
                    connection.style.left = nodeA.x + 'px';
                    connection.style.top = nodeA.y + 'px';
                    connection.style.width = length + 'px';
                    connection.style.transform = `rotate(${angle}rad)`;
                    connection.style.animationDelay = Math.random() * 4 + 's';
                    
                    container.appendChild(connection);
                    connections.push(connection);
                    
                    // Store connection references
                    nodeA.connections.push(connection);
                    nodeB.connections.push(connection);
                }
            }
        }
    }

    // Activate network with cascading waves
    function activateNetwork() {
        // Reset all connections
        connections.forEach(conn => {
            conn.classList.remove('active');
        });
        
        // Create flowing activation waves
        const waves = Math.floor(Math.random() * 3) + 2; // 2-4 waves
        
        for (let wave = 0; wave < waves; wave++) {
            setTimeout(() => {
                // Filter connections by type for more realistic activation
                const thickConnections = connections.filter(c => c.classList.contains('thick'));
                const mediumConnections = connections.filter(c => c.classList.contains('medium'));
                const thinConnections = connections.filter(c => c.classList.contains('thin'));
                
                // Prioritize thicker connections for main pathways
                const primaryActivations = Math.floor(Math.random() * 3) + 1;
                const secondaryActivations = Math.floor(Math.random() * 4) + 2;
                const tertiaryActivations = Math.floor(Math.random() * 6) + 3;
                
                // Activate thick connections first
                const shuffledThick = [...thickConnections].sort(() => 0.5 - Math.random());
                for (let i = 0; i < Math.min(primaryActivations, shuffledThick.length); i++) {
                    setTimeout(() => {
                        shuffledThick[i].classList.add('active');
                        setTimeout(() => shuffledThick[i].classList.remove('active'), 2000);
                    }, i * 150);
                }
                
                // Then medium connections
                const shuffledMedium = [...mediumConnections].sort(() => 0.5 - Math.random());
                for (let i = 0; i < Math.min(secondaryActivations, shuffledMedium.length); i++) {
                    setTimeout(() => {
                        shuffledMedium[i].classList.add('active');
                        setTimeout(() => shuffledMedium[i].classList.remove('active'), 2000);
                    }, (i + primaryActivations) * 150);
                }
                
                // Finally thin connections for subtle effects
                const shuffledThin = [...thinConnections].sort(() => 0.5 - Math.random());
                for (let i = 0; i < Math.min(tertiaryActivations, shuffledThin.length); i++) {
                    setTimeout(() => {
                        shuffledThin[i].classList.add('active');
                        setTimeout(() => shuffledThin[i].classList.remove('active'), 1500);
                    }, (i + primaryActivations + secondaryActivations) * 100);
                }
            }, wave * 1000);
        }
    }

    // Initialize network
    function initNetwork() {
        createNodes();
        createConnections();
        
        // Start periodic activation
        setInterval(activateNetwork, config.activationInterval);
        
        // Initial activation
        setTimeout(activateNetwork, 1000);
    }

    // Handle window resize
    function handleResize() {
        // Clear existing network
        container.innerHTML = '';
        nodes.length = 0;
        connections.length = 0;
        
        // Recreate with new dimensions
        config.particleCount = window.innerWidth > 768 ? 60 : 40;
        config.nodeCount = window.innerWidth > 768 ? 30 : 20;
        config.maxDistance = window.innerWidth > 768 ? 250 : 180;
        initNetwork();
    }

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 250);
    });

    // Initialize
    initNetwork();
});

// Performance optimization: Pause animations when tab is not visible
document.addEventListener('visibilitychange', function() {
    const container = document.querySelector('.neural-network');
    if (!container) return;
    
    if (document.hidden) {
        container.style.animationPlayState = 'paused';
        container.querySelectorAll('.node, .connection').forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    } else {
        container.style.animationPlayState = 'running';
        container.querySelectorAll('.node, .connection').forEach(el => {
            el.style.animationPlayState = 'running';
        });
    }
});