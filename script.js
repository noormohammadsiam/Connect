        // --- Theme Toggle Logic ---
        function toggleTheme() {
            const htmlTag = document.documentElement;
            const themeBtnIcon = document.querySelector('#themeToggleBtn i');
            
            if (htmlTag.getAttribute('data-theme') === 'dark') {
                htmlTag.setAttribute('data-theme', 'light');
                themeBtnIcon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'light');
            } else {
                htmlTag.setAttribute('data-theme', 'dark');
                themeBtnIcon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'dark');
            }
        }

        // Load Saved Theme (Strictly Dark Default) & Generate Desktop QR
        window.onload = () => {
            const savedTheme = localStorage.getItem('theme');
            
            // Set Default theme to Dark (ignore system pref)
            const defaultTheme = savedTheme ? savedTheme : 'dark';
            
            document.documentElement.setAttribute('data-theme', defaultTheme);
            document.querySelector('#themeToggleBtn i').className = defaultTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

            // Desktop Dynamic QR code Generation
            const currentUrl = encodeURIComponent(window.location.href);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${currentUrl}`;
            const desktopQrImg = document.getElementById('desktopQRImage');
            if(desktopQrImg) {
                desktopQrImg.src = qrUrl;
            }
        }

        // --- Modal Logic ---
        function openModal(id) {
            document.getElementById(id).classList.add('active');
        }

        function closeModal(id) {
            document.getElementById(id).classList.remove('active');
        }

        // Close modal on outside click
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) { closeModal(modal.id); }
            });
        });

        // --- Tab Logic ---
        function openTab(tabName, elmnt) {
            const tabcontent = document.getElementsByClassName("tab-content");
            for (let i = 0; i < tabcontent.length; i++) {
                tabcontent[i].classList.remove("active");
            }
            const tablinks = document.getElementsByClassName("tab-btn");
            for (let i = 0; i < tablinks.length; i++) {
                tablinks[i].classList.remove("active");
            }
            document.getElementById(tabName).classList.add("active");
            elmnt.classList.add("active");
        }

        // --- Share Profile Link Feature ---
        async function shareProfile(e) {
            e.preventDefault();
            const shareData = {
                title: 'Noor Mohammad Siam - Entrepreneur',
                text: 'Check out the portfolio and contact details of Noor Mohammad Siam.',
                url: window.location.href
            };
            if (navigator.share) {
                try { await navigator.share(shareData); } 
                catch (err) { console.log('Share canceled or failed:', err); }
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Profile Link copied to clipboard!');
            }
        }

        // --- Desktop QR Code Download Function ---
        async function downloadDesktopQR(e) {
            e.preventDefault();
            const qrUrl = document.getElementById('desktopQRImage').src;
            if(!qrUrl) return;
            try {
                const response = await fetch(qrUrl);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Noor_Mohammad_Siam_QR_Code.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                alert('Failed to download QR Code.');
            }
        }

        // --- Mobile QR Code Generation & Download Feature ---
        function openQRModal(e) {
            e.preventDefault();
            const currentUrl = encodeURIComponent(window.location.href);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${currentUrl}`;
            document.getElementById('qrImage').src = qrUrl;
            openModal('qrModal');
        }

        async function downloadQR() {
            const qrUrl = document.getElementById('qrImage').src;
            try {
                const response = await fetch(qrUrl);
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Noor_Mohammad_Siam_QR_Code.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            } catch (error) {
                alert('Failed to download QR Code. Please try again.');
            }
        }

        // --- Save Contact (.vcf) Feature ---
        function saveContact(e) {
            e.preventDefault();
        
            const contact = {
                firstName: "Noor Mohammad",
                lastName: "Siam",
                fullName: "Noor Mohammad Siam",
                nickname: "Siam",
                alternativeName: "N M Siam",
                phones: ["+8801560049454", "+8801708712025"],
                whatsapp: "+8801560049454",
                email: "hello@noormohammadsiam.com",
                fax: "",
                street: "Mozammal Hoque Market, Bhaukshar Bazar",
                city: "Cumilla",
                postalCode: "3500",
                state: "Chittagong Division",
                country: "Bangladesh",
                organization: "Mozammal Hoque Group",
                department: "Leadership",
                jobTitle: "CEO & Managing Director",
                website: "https://noormohammadsiam.com",
                facebook: "https://facebook.com/noormohammadsiam8",
                linkedin: "https://linkedin.com/in/noormohammadsiam",
                birthday: "2006-12-15",
                gender: "Male",
                photoUrl: "https://noormohammadsiam.com/me.jpg",
                logoUrl: "https://nmsiam-bd.github.io/assets/logo.webp",
                notes: "Founder & CEO | Tech Blogger | Entrepreneur"
            };
        
            let vcard = "BEGIN:VCARD\n";
            vcard += "VERSION:4.0\n";
            vcard += `FN:${contact.fullName}\n`;
            vcard += `N:${contact.lastName};${contact.firstName};;;\n`;
            vcard += `NICKNAME:${contact.nickname},${contact.alternativeName}\n`;
            vcard += `ORG:${contact.organization};${contact.department}\n`;
            vcard += `TITLE:${contact.jobTitle}\n`;
        
            // Photo & Logo
            if (contact.photoUrl) vcard += `PHOTO;VALUE=URI:${contact.photoUrl}\n`;
            if (contact.logoUrl) vcard += `LOGO;VALUE=URI:${contact.logoUrl}\n`;
        
            // Phones
            contact.phones.forEach(phone => {
                vcard += `TEL;TYPE=cell,voice:${phone}\n`;
            });
        
            // WhatsApp
            if (contact.whatsapp) {
                vcard += `IMPP;X-SERVICE-TYPE=WhatsApp:https://wa.me/${contact.whatsapp.replace(/\+/g,"")}\n`;
            }
        
            // Fax
            if (contact.fax) vcard += `TEL;TYPE=fax:${contact.fax}\n`;
        
            // Email
            vcard += `EMAIL;TYPE=internet,work:${contact.email}\n`;
        
            // Address
            vcard += `ADR;TYPE=work:;;${contact.street};${contact.city};${contact.state};${contact.postalCode};${contact.country}\n`;
        
            // Website
            vcard += `URL:${contact.website}\n`;
        
            // Social Links (Facebook, LinkedIn)
            vcard += `IMPP;X-SERVICE-TYPE=facebook:${contact.facebook}\n`;
            vcard += `IMPP;X-SERVICE-TYPE=linkedin:${contact.linkedin}\n`;
        
            // Birthday, Gender, Notes
            vcard += `BDAY:${contact.birthday.replace(/-/g,"")}\n`;
            vcard += `X-GENDER:${contact.gender}\n`;
            vcard += `NOTE:${contact.notes}\n`;
        
            vcard += "END:VCARD";
        
            // Create Blob and Download
            const blob = new Blob([vcard], { type: "text/vcard" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${contact.fullName.replace(/ /g,"_")}_Advanced.vcf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
