const { createApp, ref, computed, onMounted } = Vue;

createApp({
    setup() {
        const currentStep = ref(0);
        const totalSteps = 9;
        const isSubmitted = ref(false);
        const isMobile = ref(window.innerWidth < 768);

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
            if (currentStep.value === 0) {
                currentStep.value++;
            } else if (currentStep.value < totalSteps - 1) {
                currentStep.value++;
            } else {
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

        const handleSubmit = () => {
            console.log('提交數據:', formData.value);
            isSubmitted.value = true;
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
            handleSubmit, restartForm, isMobile, getSelectedLabel
        };
    }
}).mount('#app');
