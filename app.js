const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const currentStep = ref(0);
        const totalSteps = 9;
        const isSubmitted = ref(false);
        const isMobile = ref(window.innerWidth < 768);
        const isSubmitting = ref(false); // 提交狀態

        const formData = ref({
            name: '',
            attendance: '',
            guests: 1,
            dietary: [],
            chineseCookie:[],
            song: '',
            message:'',
        });

        const dietaryOptions = [
            { label: '沒有特殊要求', value: 'none' },
            { label: '素食 (奶蛋素)', value: 'vegetarian' },
            { label: '純素 (Vegan)', value: 'vegan' }
        ];

        const chineseCookieOptions = [
            { label: '滷肉豆沙蛋黃', value: 'saltEgg' },
            { label: '咖哩滷肉', value: 'curry' },
            { label: '芋頭麻糬', value: 'taro' },
            { label: '抹茶麻糬', value: 'greenTea' },
            { label: '清豆沙', value: 'bean' }
        ];

        const progressPercentage = computed(() => {
            return ((currentStep.value) / (totalSteps - 1)) * 100;
        });

        const nextStep = () => {
            // 1️⃣ 檢查第 1 步必填項（姓名）
            if (currentStep.value === 1 && !formData.value.name.trim()) {
                return;
            }
            // 2️⃣ 檢查第 2 步必填項（參加狀況）
            if (currentStep.value === 2 && !formData.value.attendance) {
                return;
            }

            // 3️⃣ 進入下一步
            if (currentStep.value < totalSteps - 1) {
                currentStep.value++;
        
            // 4️⃣ 只在第 3 步之後才進行跳過邏輯
            // 如果選「無法參加」，直接跳到第 7 步（留言）
            if (formData.value.attendance === 'no' && currentStep.value === 3) {
                currentStep.value = 7;
            }
            if (formData.value.attendance === 'no' && currentStep.value === 7) {
                currentStep.value = 8;
            }

            } else {
            // 5️⃣ 最後一步提交
            handleSubmit();
            }
        };

        const prevStep = () => {
            if (currentStep.value > 0) currentStep.value--;
        };

        const selectAttendance = (val) => {
            formData.value.attendance = val;
            setTimeout(nextStep, 300); // 選完自動跳下一步，Typeform 體驗
        };

        const toggleDietary = (val) => {
            const index = formData.value.dietary.indexOf(val);
            if (index > -1) {
                formData.value.dietary.splice(index, 1);
            } else {
                formData.value.dietary.push(val);
            }
        };

        const toggleCookie = (val) => {
            const index = formData.value.chineseCookie.indexOf(val);
            if (index > -1) {
                formData.value.chineseCookie.splice(index, 1);
            } else {
                formData.value.chineseCookie.push(val);
            }
        };

        const handleSubmit = async () => {
            console.log('提交數據:', formData.value);
            isSubmitting.value = true;

            const scriptUrl = 'https://script.google.com/macros/s/AKfycbxUHi400qm99m80xaLTgXE90XpN3SgJObaE3KT-s40WoaO38G1s063IBT4QCL9rB-jw/exec'; // 貼你的部署 URL
            const payload = new FormData();
            payload.append('name', formData.value.name);
            payload.append('attendance', formData.value.attendance);
            payload.append('guests', formData.value.guests);
            payload.append('dietary', formData.value.dietary.join(', '));
            payload.append('chineseCookie', formData.value.chineseCookie.join(', '));
            payload.append('song', formData.value.song);
            payload.append('message', formData.value.message);
            
            try {
                const response = await fetch(scriptUrl, {
                    method: 'POST',
                    body: payload,
                    mode: 'no-cors'
                });
                console.log('提交成功');
                isSubmitted.value = true;
            } catch(error) {
                console.error('提交失敗:', error);
                alert('提交失敗，請稍後重試');
            } finally{
                isSubmitting.value = false;
            }
        };

        const restartForm = () => {
            currentStep.value = 0;
            isSubmitted.value = false;
            formData.value = { name: '', attendance: '', guests: 1, dietary: [], chineseCookie: [], song: '', message: '' };
        };

        // 監聽鍵盤快捷鍵
        onMounted(() => {
            window.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !isSubmitted.value) {
                    // 避免 Textarea 換行衝突
                    if (e.target.tagName !== 'TEXTAREA') nextStep();
                }
            });
        });

        const getSelectedLabel = (values, options) => {
            if (!values || values.length === 0) return '';
            return values.map(val => {
                const opt = options.find(o => o.value === val);
                return opt ? opt.label : val;
            }).join(', ');
        };

        return {
            currentStep, totalSteps, formData, isSubmitted, 
            progressPercentage, nextStep, prevStep, selectAttendance,
            dietaryOptions, chineseCookieOptions, toggleDietary, toggleCookie, 
            handleSubmit, restartForm, isMobile, getSelectedLabel,isSubmitting
        };
    }
}).mount('#app');
