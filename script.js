// 全域變數
var currentStep = 0;
var totalSteps = 4;
var planData = {
    vision50: '',
    actionPlan10: '',
    actionPlan5: '',
    actionPlan1: '',
    immediateAction3months: '',
    immediateActionSaved: false,
    priorities: [],
    timeAllocation: {},
    satisfaction: false
};

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function () {
    updateProgress();
    initializeDragAndDrop();
});

// 下一步功能
function nextStep() {
    try {
        if (currentStep === 0) {
            var visionInput = document.getElementById('vision50');
            if (!visionInput) {
                showToast('找不到願景輸入框！', 'error');
                return;
            }

            var vision = visionInput.value.trim();
            if (!vision) {
                showToast('請先填寫你的五十歲願景再繼續！', 'error');
                return;
            }

            planData.vision50 = vision;

            var visionDisplay = document.getElementById('vision50Display');
            var visionReminder = document.getElementById('vision50Reminder');
            if (visionDisplay) visionDisplay.textContent = vision;
            if (visionReminder) visionReminder.style.display = 'block';

            var header = document.querySelector('.header');
            var progressContainer = document.querySelector('.progress-container');
            if (header) header.style.display = 'none';
            if (progressContainer) progressContainer.style.display = 'block';

            createTimeAllocation();
        } else if (currentStep === 1) {
            var sliders = document.querySelectorAll('#timeAllocation10 .slider-container');
            var hasAdjustedTime = false;
            for (var i = 0; i < sliders.length; i++) {
                if (sliders[i].getValue && sliders[i].getValue() > 1) {
                    hasAdjustedTime = true;
                }
            }

            if (!hasAdjustedTime) {
                showToast('⏰ 請先調整你的十年時間分配！', 'error');
                return;
            }

            var total = calculateTotalTime();
            if (total > 168) {
                showToast('⚠️ 時間分配超過限制！', 'error');
                return;
            }
            if (total < 10) {
                showToast('⏰ 你的時間投入似乎過少！', 'error');
                return;
            }

            var actionPlanInput = document.getElementById('actionPlan10');
            if (!actionPlanInput || !actionPlanInput.value.trim()) {
                showToast('📝 請填寫你的十年行動計劃再繼續！', 'error');
                return;
            }

            planData.actionPlan10 = actionPlanInput.value.trim();

            var satisfactionCheckbox = document.getElementById('satisfaction10');
            if (!satisfactionCheckbox || !satisfactionCheckbox.checked) {
                showToast('✅ 請確認你對這個十年規劃滿意後再繼續！', 'error');
                return;
            }

            showToast('🎉 恭喜完成十年規劃！', 'success');
        } else if (currentStep === 2) {
            var sliders5 = document.querySelectorAll('#timeAllocation5 .slider-container');
            var hasAdjustedTime5 = false;
            for (var i = 0; i < sliders5.length; i++) {
                if (sliders5[i].getValue && sliders5[i].getValue() > 1) {
                    hasAdjustedTime5 = true;
                }
            }

            if (!hasAdjustedTime5) {
                showToast('⏰ 請先調整你的五年時間分配！', 'error');
                return;
            }

            var total5 = calculateTotalTime('5');
            if (total5 > 168) {
                showToast('⚠️ 時間分配超過限制！', 'error');
                return;
            }
            if (total5 < 10) {
                showToast('⏰ 你的時間投入似乎過少！', 'error');
                return;
            }

            var actionPlan5Input = document.getElementById('actionPlan5');
            if (!actionPlan5Input || !actionPlan5Input.value.trim()) {
                showToast('📝 請填寫你的五年行動計劃再繼續！', 'error');
                return;
            }

            planData.actionPlan5 = actionPlan5Input.value.trim();

            var satisfaction5Checkbox = document.getElementById('satisfaction5');
            if (!satisfaction5Checkbox || !satisfaction5Checkbox.checked) {
                showToast('✅ 請確認你對這個五年規劃滿意後再繼續！', 'error');
                return;
            }

            showToast('🚀 很棒！五年規劃完成！', 'success');
        } else if (currentStep === 3) {
            var sliders1 = document.querySelectorAll('#timeAllocation1 .slider-container');
            var hasAdjustedTime1 = false;
            for (var i = 0; i < sliders1.length; i++) {
                if (sliders1[i].getValue && sliders1[i].getValue() > 1) {
                    hasAdjustedTime1 = true;
                }
            }

            if (!hasAdjustedTime1) {
                showToast('⏰ 請調整你的一年時間分配！', 'error');
                return;
            }

            var total1 = calculateTotalTime('1');
            if (total1 > 168) {
                showToast('⚠️ 時間分配超過限制！', 'error');
                return;
            }
            if (total1 < 10) {
                showToast('⏰ 你的時間投入似乎過少！', 'error');
                return;
            }

            var actionPlan1Input = document.getElementById('actionPlan1');
            if (!actionPlan1Input || !actionPlan1Input.value.trim()) {
                showToast('📝 請填寫你的一年行動計劃再繼續！', 'error');
                return;
            }

            planData.actionPlan1 = actionPlan1Input.value.trim();

            var satisfaction1Checkbox = document.getElementById('satisfaction1');
            if (!satisfaction1Checkbox || !satisfaction1Checkbox.checked) {
                showToast('✅ 請確認你對這個一年規劃滿意後再繼續！', 'error');
                return;
            }

            planData.priorities = getPriorities();
            planData.timeAllocation = getTimeAllocation();
            planData.satisfaction = true;

            showToast('🎉 完整規劃完成！', 'success');

            createCompletionPage();
            return;
        }

        if (currentStep < totalSteps) {
            var allSteps = document.querySelectorAll('.step-card');
            for (var i = 0; i < allSteps.length; i++) {
                allSteps[i].classList.add('hidden');
                allSteps[i].classList.remove('active');
            }
            currentStep++;
            var nextEl = document.getElementById('step' + currentStep);
            if (nextEl) {
                nextEl.classList.remove('hidden');

                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

                setTimeout(function () {
                    nextEl.classList.add('active');
                    if (currentStep === 1) {
                        createTimeAllocation('10');
                    } else if (currentStep === 2) {
                        var visionDisplay2 = document.getElementById('vision50Display2');
                        var visionReminder2 = document.getElementById('vision50Reminder2');
                        if (visionDisplay2 && planData.vision50) {
                            visionDisplay2.textContent = planData.vision50;
                        }
                        if (visionReminder2) {
                            visionReminder2.style.display = 'block';
                        }
                        showStep1Reference();
                        copyPrioritiesToNextStep('priorities10', 'priorities5');
                        setTimeout(function () {
                            createTimeAllocation('5');
                        }, 300);
                    } else if (currentStep === 3) {
                        var visionDisplay3 = document.getElementById('vision50Display3');
                        var visionReminder3 = document.getElementById('vision50Reminder3');
                        if (visionDisplay3 && planData.vision50) {
                            visionDisplay3.textContent = planData.vision50;
                        }
                        if (visionReminder3) {
                            visionReminder3.style.display = 'block';
                        }
                        showStep1And2Reference();
                        copyPrioritiesToNextStep('priorities5', 'priorities1');
                        setTimeout(function () { createTimeAllocation('1'); }, 300);
                    }
                }, 100);
            }
            updateProgress();
        }
    } catch (error) {
        console.error('下一步出错:', error);
        showToast('操作出现错误，请重试', 'error');
    }
}

// 上一步功能
function prevStep() {
    if (currentStep > 0) {
        var allSteps = document.querySelectorAll('.step-card');
        for (var i = 0; i < allSteps.length; i++) {
            allSteps[i].classList.add('hidden');
            allSteps[i].classList.remove('active');
        }
        currentStep--;
        var prevEl = document.getElementById('step' + currentStep);
        if (prevEl) {
            prevEl.classList.remove('hidden');

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            setTimeout(function () {
                prevEl.classList.add('active');
            }, 100);
        }
        updateProgress();
    }
}

// 更新進度條
function updateProgress() {
    var progress = (currentStep / totalSteps) * 100;
    var progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
}

// 複製優先級到下一步驟
function copyPrioritiesToNextStep(fromId, toId) {
    var fromContainer = document.getElementById(fromId);
    var toContainer = document.getElementById(toId);
    if (!fromContainer || !toContainer) {
        return;
    }
    var fromItems = fromContainer.querySelectorAll('.priority-item .priority-text');
    if (fromItems.length === 0) {
        return;
    }

    // 保存當前時間分配
    var savedTimeAllocation = {};
    var currentStep = fromId.replace('priorities', '');
    var sliders = document.querySelectorAll('#timeAllocation' + currentStep + ' .slider-container');
    for (var i = 0; i < sliders.length; i++) {
        var priority = sliders[i].dataset.priority;
        if (priority && sliders[i].getValue) {
            savedTimeAllocation[priority] = sliders[i].getValue();
        }
    }

    toContainer.innerHTML = '';
    for (var i = 0; i < fromItems.length; i++) {
        var priorityText = fromItems[i].textContent.trim();
        var newItem = document.createElement('div');
        newItem.className = 'priority-item';
        newItem.draggable = true;
        newItem.innerHTML = '<span class="priority-text">' + priorityText + '</span>' +
            '<div class="priority-actions">' +
            '<button class="edit-btn" onclick="editPriority(this)">✏️ 編輯</button>' +
            '<button class="cancel-btn" onclick="removePriority(this)">🗑️ 刪除</button>' +
            '<div class="priority-rank">' + (i + 1) + '</div>' +
            '</div>';
        toContainer.appendChild(newItem);
    }
    var addButton = document.createElement('button');
    addButton.className = 'add-priority-btn';
    addButton.type = 'button';
    addButton.onclick = addNewPriority;
    addButton.innerHTML = '➕ 新增人生領域';
    toContainer.appendChild(addButton);

    // 保存時間分配
    // window.savedTimeAllocationForNextStep = savedTimeAllocation;

    setTimeout(function () {
        initializeDragAndDrop();
    }, 100);
}

// 顯示第一步規劃結果
function showStep1Reference() {
    var priorities = getPriorities('priorities10');
    var timeAllocation = getTimeAllocation('10');
    var total = calculateTotalTime('10');
    var summaryContainer = document.getElementById('step1Summary');
    var referenceContainer = document.getElementById('step1Reference');
    if (!summaryContainer || !referenceContainer) return;
    var summaryHTML = '<strong style="color: #ef6c00; font-size: 1.1rem;">總投入時間：' + total + ' / 168 小時 (' + ((total / 168) * 100).toFixed(1) + '%)</strong><br><br>';
    for (var i = 0; i < priorities.length; i++) {
        var hours = timeAllocation[priorities[i]] || 0;
        var percentage = ((hours / 168) * 100).toFixed(1);
        summaryHTML += '<div style="margin-bottom: 8px;">';
        summaryHTML += '<strong>' + (i + 1) + '. ' + priorities[i] + '：</strong> ';
        summaryHTML += hours + ' 小時 (' + percentage + '%)';
        summaryHTML += '</div>';
    }
    if (planData.actionPlan10) {
        summaryHTML += '<br><div style="background: rgba(239, 108, 0, 0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">';
        summaryHTML += '<strong style="color: #ef6c00;">📋 十年行動計劃：</strong><br>';
        summaryHTML += '<span style="color: #ef6c00; line-height: 1.5;">' + planData.actionPlan10 + '</span>';
        summaryHTML += '</div>';
    }
    summaryContainer.innerHTML = summaryHTML;
    referenceContainer.style.display = 'block';
}

// 顯示第一步和第二步規劃結果
function showStep1And2Reference() {
    var priorities1 = getPriorities('priorities10');
    var timeAllocation1 = getTimeAllocation('10');
    var total1 = calculateTotalTime('10');
    var summaryContainer1 = document.getElementById('step1Summary3');
    var referenceContainer1 = document.getElementById('step1Reference3');
    if (summaryContainer1 && referenceContainer1) {
        var summaryHTML1 = '<strong style="color: #ef6c00; font-size: 1.1rem;">總投入時間：' + total1 + ' / 168 小時 (' + ((total1 / 168) * 100).toFixed(1) + '%)</strong><br><br>';
        for (var i = 0; i < priorities1.length; i++) {
            var hours1 = timeAllocation1[priorities1[i]] || 0;
            var percentage1 = ((hours1 / 168) * 100).toFixed(1);
            summaryHTML1 += '<div style="margin-bottom: 8px;">';
            summaryHTML1 += '<strong>' + (i + 1) + '. ' + priorities1[i] + '：</strong> ';
            summaryHTML1 += hours1 + ' 小時 (' + percentage1 + '%)';
            summaryHTML1 += '</div>';
        }
        if (planData.actionPlan10) {
            summaryHTML1 += '<br><div style="background: rgba(239, 108, 0, 0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">';
            summaryHTML1 += '<strong style="color: #ef6c00;">📋 十年行動計劃：</strong><br>';
            summaryHTML1 += '<span style="color: #ef6c00; line-height: 1.5;">' + planData.actionPlan10 + '</span>';
            summaryHTML1 += '</div>';
        }
        summaryContainer1.innerHTML = summaryHTML1;
        referenceContainer1.style.display = 'block';
    }

    var priorities2 = getPriorities('priorities5');
    var timeAllocation2 = getTimeAllocation('5');
    var total2 = calculateTotalTime('5');
    var summaryContainer2 = document.getElementById('step2Summary3');
    var referenceContainer2 = document.getElementById('step2Reference3');
    if (summaryContainer2 && referenceContainer2) {
        var summaryHTML2 = '<strong style="color: #6a1b9a; font-size: 1.1rem;">總投入時間：' + total2 + ' / 168 小時 (' + ((total2 / 168) * 100).toFixed(1) + '%)</strong><br><br>';
        for (var i = 0; i < priorities2.length; i++) {
            var hours2 = timeAllocation2[priorities2[i]] || 0;
            var percentage2 = ((hours2 / 168) * 100).toFixed(1);
            summaryHTML2 += '<div style="margin-bottom: 8px;">';
            summaryHTML2 += '<strong>' + (i + 1) + '. ' + priorities2[i] + '：</strong> ';
            summaryHTML2 += hours2 + ' 小時 (' + percentage2 + '%)';
            summaryHTML2 += '</div>';
        }
        if (planData.actionPlan5) {
            summaryHTML2 += '<br><div style="background: rgba(106, 27, 154, 0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">';
            summaryHTML2 += '<strong style="color: #6a1b9a;">📋 五年行動計劃：</strong><br>';
            summaryHTML2 += '<span style="color: #6a1b9a; line-height: 1.5;">' + planData.actionPlan5 + '</span>';
            summaryHTML2 += '</div>';
        }
        summaryContainer2.innerHTML = summaryHTML2;
        referenceContainer2.style.display = 'block';
    }
}

// 創建完成頁面
function createCompletionPage() {
    var container = document.querySelector('.container');
    var currentEl = document.getElementById('step3');
    if (currentEl) {
        currentEl.classList.add('hidden');
        currentEl.classList.remove('active');
    }
    var existingCompletion = document.getElementById('completion');
    if (existingCompletion) {
        existingCompletion.remove();
    }
    var completionPage = document.createElement('div');
    completionPage.className = 'step-card active';
    completionPage.id = 'completion';

    var priorities10 = getPriorities('priorities10');
    var timeAllocation10 = getTimeAllocation('10');
    var total10 = calculateTotalTime('10');

    var priorities5 = getPriorities('priorities5');
    var timeAllocation5 = getTimeAllocation('5');
    var total5 = calculateTotalTime('5');

    var priorities1 = getPriorities('priorities1');
    var timeAllocation1 = getTimeAllocation('1');
    var total11 = calculateTotalTime('1');

    function makeSliderList(priorities, timeAllocation, color) {
        var list = '';
        for (var i = 0; i < priorities.length; i++) {
            var hours = timeAllocation[priorities[i]] || 0;
            var percentage = ((hours / 168) * 100).toFixed(1);
            var sliderWidth = Math.min((hours / 60) * 100, 100);

            list += '<div style="background: white; border-radius: 12px; padding: 20px; margin: 10px 0; border: 2px solid #e9ecef;">' +
                '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
                '<span style="font-weight: 600; font-size: 1.1rem;">' + (i + 1) + '. ' + priorities[i] + '</span>' +
                '<span style="color: ' + color + '; font-weight: 700; font-size: 1.1rem;">' + hours + ' 小時 (' + percentage + '%)</span>' +
                '</div>' +
                '<div style="position: relative; width: 100%; height: 30px; background: #e9ecef; border-radius: 15px; overflow: hidden;">' +
                '<div style="position: absolute; top: 0; left: 0; height: 100%; background: ' + color + '; border-radius: 15px; width: ' + sliderWidth + '%; transition: width 0.3s ease;"></div>' +
                '<div style="position: absolute; top: 50%; left: ' + sliderWidth + '%; width: 24px; height: 24px; background: white; border: 3px solid ' + color + '; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 2px 6px rgba(0,0,0,0.2);"></div>' +
                '</div>' +
                '</div>';
        }
        return list;
    }

    completionPage.innerHTML =
        '<div class="step-title">' +
        '<div class="step-number">✅</div>' +
        '規劃完成！' +
        '</div>' +

        '<div style="background: linear-gradient(135deg, #e8f5e8, #c8e6c9); border: 3px solid #4caf50; border-radius: 15px; padding: 25px; margin-bottom: 30px;">' +
        '<h3 style="color: #2e7d32; margin-bottom: 15px; font-size: 1.3rem;">🎯 你的五十歲願景</h3>' +
        '<p style="color: #1b5e20; line-height: 1.6; font-style: italic; font-size: 1.1rem;">' + planData.vision50 + '</p>' +
        '</div>' +

        '<div style="background: linear-gradient(135deg, #fff8e1, #ffecb3); border: 3px solid #ffc107; border-radius: 15px; padding: 25px; margin-bottom: 20px;">' +
        '<h3 style="color: #e65100; margin-bottom: 20px; font-size: 1.3rem;">📊 你的十年規劃</h3>' +
        '<div style="margin-bottom: 15px;">' +
        '<strong style="color: #ef6c00; font-size: 1.1rem;">總投入時間：' + total10 + ' / 168 小時 (' + ((total10 / 168) * 100).toFixed(1) + '%)</strong>' +
        '</div>' +
        makeSliderList(priorities10, timeAllocation10, '#ef6c00') +
        (planData.actionPlan10 ? '<div style="background: rgba(239, 108, 0, 0.1); padding: 15px; border-radius: 8px; margin-top: 15px;"><strong style="color: #ef6c00;">📋 十年行動計劃：</strong><br><span style="color: #ef6c00; line-height: 1.5;">' + planData.actionPlan10 + '</span></div>' : '') +
        '</div>' +

        '<div style="background: linear-gradient(135deg, #f3e5f5, #e1bee7); border: 3px solid #9c27b0; border-radius: 15px; padding: 25px; margin-bottom: 20px;">' +
        '<h3 style="color: #4a148c; margin-bottom: 20px; font-size: 1.3rem;">📋 你的五年規劃</h3>' +
        '<div style="margin-bottom: 15px;">' +
        '<strong style="color: #6a1b9a; font-size: 1.1rem;">總投入時間：' + total5 + ' / 168 小時 (' + ((total5 / 168) * 100).toFixed(1) + '%)</strong>' +
        '</div>' +
        makeSliderList(priorities5, timeAllocation5, '#6a1b9a') +
        (planData.actionPlan5 ? '<div style="background: rgba(106, 27, 154, 0.1); padding: 15px; border-radius: 8px; margin-top: 15px;"><strong style="color: #6a1b9a;">📋 五年行動計劃：</strong><br><span style="color: #6a1b9a; line-height: 1.5;">' + planData.actionPlan5 + '</span></div>' : '') +
        '</div>' +

        '<div style="background: white; border: 3px solid #607d8b; border-radius: 15px; padding: 25px; margin-bottom: 30px;">' +
        '<h3 style="color: #455a64; margin-bottom: 20px; font-size: 1.3rem;">🚀 你的一年規劃（重點）</h3>' +
        '<div style="margin-bottom: 20px;">' +
        '<strong style="color: #607d8b; font-size: 1.2rem;">總投入時間：' + total11 + ' / 168 小時 (' + ((total11 / 168) * 100).toFixed(1) + '%)</strong>' +
        '</div>' +
        makeSliderList(priorities1, timeAllocation1, '#607d8b') +
        (planData.actionPlan1 ? '<div style="background: rgba(96, 125, 139, 0.1); padding: 15px; border-radius: 8px; margin-top: 15px;"><strong style="color: #607d8b;">📋 一年行動計劃：</strong><br><span style="color: #607d8b; line-height: 1.5;">' + planData.actionPlan1 + '</span></div>' : '') +
        '</div>' +

        '<div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); border: 3px solid #2196f3; border-radius: 15px; padding: 25px; margin-bottom: 30px;">' +
        '<h3 style="color: #1565c0; margin-bottom: 15px; font-size: 1.3rem;">💡 下一步建議</h3>' +
        '<ul style="color: #1976d2; line-height: 1.8; padding-left: 20px; margin-bottom: 20px;">' +
        '<li>將這個規劃保存下來，定期回顧和調整</li>' +
        '<li>專注執行一年計畫，這是最關鍵的行動指南</li>' +
        '<li>每季檢視進度，確保朝著五十歲願景前進</li>' +
        '<li>記錄實際時間分配，與規劃進行對比調整</li>' +
        '</ul>' +
        '<div style="margin-top: 25px;">' +
        '<label for="immediateAction3months" style="display: block; font-weight: 600; color: #1565c0; margin-bottom: 12px; font-size: 1.1rem;">請打上你三個月內立即可以完成的行動：</label>' +
        '<textarea id="immediateAction3months" rows="4" placeholder="例如：建立晨間運動習慣、完成線上課程、建立理財帳戶、改善工作流程..." style="width: 100%; padding: 15px; border: 2px solid #2196f3; border-radius: 10px; font-size: 1rem; font-family: inherit; resize: vertical; margin-bottom: 15px;"></textarea>' +
        '<div style="text-align: center;">' +
        '<button id="saveImmediateAction" onclick="saveImmediateAction()" style="padding: 12px 30px; background: #2196f3; color: white; border: none; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-right: 10px;">💾 儲存行動計劃</button>' +
        '<button id="editImmediateAction" onclick="editImmediateAction()" style="display: none; padding: 12px 30px; background: #ff9800; color: white; border: none; border-radius: 25px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; margin-right: 10px;">✏️ 修改計劃</button>' +
        '<span id="saveStatus" style="display: inline-block; padding: 4px 0; color: #666; font-weight: 600; font-size: 0.9rem; margin-left: 15px;">📝 尚未儲存</span>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 20px; padding: 30px; margin: 40px 0; color: white; position: relative; overflow: hidden;">' +
        '<div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.5;"></div>' +
        '<div style="position: absolute; bottom: -30px; left: -30px; width: 100px; height: 100px; background: rgba(255,255,255,0.1); border-radius: 50%; opacity: 0.3;"></div>' +
        '<div style="position: relative; z-index: 2;">' +
        '<h3 style="color: white; margin-bottom: 20px; font-size: 1.4rem; text-align: center;">🌟 對你的人生與生涯有迷惘嗎？</h3>' +
        '<div style="text-align: center; margin-bottom: 25px;">' +
        '<h4 style="color: white; font-size: 1.2rem; margin: 0 0 15px 0; font-weight: 600;">您好，我是職海中的PM旅人</h4>' +
        '<p style="color: rgba(255,255,255,0.9); line-height: 1.8; font-size: 1rem; margin: 15px 0;">在職場的海洋中載浮載沉，我願意作為你的旅伴<br>為你點亮一盞明燈，陪你照亮職涯的每一哩路</p>' +
        '<p style="color: rgba(255,255,255,0.8); font-size: 0.9rem; margin: 20px 0 10px 0;">📚 我的職涯文章分享</p>' +
        '<a href="https://vocus.cc/tags/%E8%81%B7%E6%B5%B7%E4%B8%AD%E7%9A%84PM%E6%97%85%E4%BA%BA" target="_blank" style="color: white; text-decoration: underline; font-size: 0.9rem; opacity: 0.9;">職海中的PM旅人 - 過往文章</a>' +
        '</div>' +
        '<div style="display: flex; flex-wrap: wrap; gap: 20px; justify-content: center; align-items: center; margin: 25px 0;">' +
        '<div style="text-align: center; background: white; padding: 20px; border-radius: 15px; box-shadow: 0 8px 20px rgba(0,0,0,0.1);">' +
        '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAARGVYSWZNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAIcoAMABAAAAAEAAAIcAAAAACyhPioAAG3YSURBVHic7Z13YBzVtf8/d2aLVlrZam6SJdnGtmwMNmCD6SEJJcEmCZCEnkAIee/3XoAkBAgJBEIJnfT3XipptFSSYBJKGtWAbTDY2DLuKpZsda20u1Pu/f0xs6NdWbvaXa3sFH15fsTD7p45586duXPuOd+vUEopJjCBCYwI7WCfwAQm8I+MiQkygQlkwMQEmcAEMmBigkxgAhkwMUEmMIEMmJggE5hABkxMkAlMIAMmJsgEJpABvkL90ICMY0gThQJEoX52P/iERolWhC4m5vY/EwxlMWjHkUjG7/pQCDSKND8hLVCQXxzTBGkxuvht12qe6VnP1lgbPfYAUsmCnFg6FGtBagIVHBOez4erjuPY8PxxtQewKdpMp9WPAIq1Ig4vrsMndHbF99FkdCAQ+ITGYcX1lGjBcbQd5PDi+oy2O6w+GqOtgHMZzg9VU+WbxICMs2FwF5aSKBR1gSrqglOwlM1bg7sYlHEUUOkrZWFoZkHO3VQWz/a8yeNdr/DG4A7azV7i0izIb6eDT+hU+SexsGgmKyqWsrJ8GZP14rx/T+RTamIpm2+3PckDrb+nKb4XEAiho43jkyMBhXInoaRIK+LsiuXcVnchhxRNHxd7m6MtvGvjjXSYfd7F+OuG6zlt8hKO2/AF1g1sw4cPqSxurb+IL9V8uGC2N0WbOWXjTZ5tXWj8uuE6zig7kqPfupb1AzvxoSOVxe31l3BDzTlcsOUBHu14Dp/mx5Im51WdxKPzr+HOll9z466fowkfFjZHlszmlcPv5qmeN/hw4z3exJnin8RfF93OwlDNmM795f5Gvrj7IZ7r24hUFrjXhxjna0QBColSzpPq8OJ6vlx7Hh+uPC6v38v5CdJnD/Kf27/LI/v+jiZ0AgW+Y2YFoQNgI3mk4++sjmzhJ3Ov4qRJhxbcVKfVT689iCac4Y3LGO1mD3Fl0mb0oKEjhEAqSVO8o6C2u6wI3VbEs21IgzazB0vZtMa70NA8282u7RajE8C7EJvdvzfFO5FIdCHQlEar0Y2hbNrMHuLSwK8FUCi67UE6rT4g/wny031/46odP6DXiuDXAvjc8Tpw0LxV3FvR3Vyw5X7W15zDV+ouyPkmntNC3lCWMzn2/u0gOZ4KgSCgBdkRa+f8LffzxsDOcbCR+oeke6AmROpxUdi7o3CtZWNbc207/xb7HRdJx4X3udTfTfUzP/yq82X+Y9v/0m9HCWiBA7CmyIyA8IEQ3N78S77a/Kucv5/TBPnftj/xyL6/49eDaR13HnHj8086BDQ/rUYn/73juwzYsVxcGhXF7hPSlCaGNEFJirUgPqHjFz5saTjHpUlYKyqo7ZAWRCCSbNtOggKNoPCn2C5xbRdpAUh8XprO38E5N/e4LQ0Cwo+Ok/BA2RjSxJSm966TD7bH2vnMzh8SV1bGm+eBvj40BLrm4/bmX/Js7/qcfMr6HaTV6ObYt66jxega0XlDWaAkuvCNy5NFoZxBR+HT/CM+Kg1p8N1D/otPTTu9YHYtZbOqe633QjxZL+aDFcdQqod4vm8TGwd3I4TAL3TeV3Yk1YGKgtk2lc2T3WtpMjoRkGL7ub6NvDm4Cw2BX/g4s3wpNYEKNg428WL/Ji+XeELpQhYV19JidPJk9zpMZSGVYnHJLE6edCj9dpTHu16lzx5EAbWBSs4sX4o/jzH87+3f43/aVo247LaVxFYWCGdyjwcc32w0oY98jUqTd01axNOLbnGeLFkg6wnynbY/8unt3yUwQvrMkCZHl87j41PezaLiWoLCn2E+5weJYq/Rw+Pdr/DLzpcxpbVfqtdQJseFF/C3w27LOgBjgUIRcZ9YutC8O6+tJF1WBIVCABW+Uu9cO61+bDfTN9lX7F0sPdYAcWUBENaD3hMhH0TsmGtbENbz/50BGSNixwEICh9lvpK0n20xOjn6zWvZa/btNy6msqj0lXLJlFM4rWyJm1Uq/OIrKuOsjmzhwfa/sC22h4CWOhEVChQ8u+gWTp60KKvfzOoqUiie7nmDkZwypMllU9/L12dfziQ9lJXRseCcymP5QPkxXLHtO0RkDC1plegTPjZEd/NOdA+LimvH9TwGZZzzt9zP6v4t+ISOVJLb6i7kimmn8fldP+bn+/6OX/gwlcUlU07hgVmX8f32Z7hp90NoQsdSNseE5/H4ghtY3d/IRe98DUNZSBQz/OX8fsEN1AWn5Hxen9v5I36WZPviKafwtVmX5fw7TfEOztr8VfaYPWg4a/mfz/tM2kTI6sg7tBnd+IddlJaymVM0nYfnfZZjwvNyPo9c8d7Ji7mk6hQ+tvUb/L13Q8okEQgMFeeZ3vVZT5Cs3kEGpcHWWBti2J3BUhZHl87jW7M/eUAmRwIfrjyOG2rOxZZ2ynENQcSOsjW+Z9zPoc+O8lpkG/vMPvaavbQbHawd2AbAy/1b6DB72Gv20mH08FpkKwCvD+yg3ehgr9nLPrOPNQPbiMo4m6PN7I61sc/so8PsZ/3gTlrN7pzPSaF4JbKVDmPI9iuRLXn512p2sX5wBx1mH/vMPnbH2ng72pz28xsHdu/3HqBQ+IXON2ddfkAmRwJ1wSp+cMh/MT1Q7j2thyB4e7Ap69/KaoIY0qTHHthv3S+V5NIp76FkDI/xfHHJlFOYHqjYLwBKSbqtyLjbFzibUrrQnCWF+79xj+Md19Dd9bAuhPc5XWjeOl8MO+4bw57ScNv5vw+K/fzTMlwuHVbffsdMZbM0PJczyo7M8xzyx9yiGZxVvsx570mBoMceRGb5EpDlEov9dsgVCp/m47DiuqwMFRpT/JOoD05hj9mNPmzg9r9rFB4aGraysWUcW+gg40kXkAIZxxAKpEHiNU8gQBoYCFA2prLREhNIGhhuDtD59fwmiErYxrWd59ugT2hY0nLPR4A0nQmeBjYjxFzZLAzNPGhlQYtLZo14XCrljEkWafkxvcnq6HllOwoBgaBI84NS41n6lRaVvjBfqT2fVyPvoKHh0zQ+MfU9ANxQcy6/D9U6A6AUH6g4BoDLpr4HhcJUzk7vsvBcSrQgp09ewjW1H6HPiqJQzApOzavcQyC4vvpsDi2aiRACpRRnVRydl38LQjXcXn8Ju2J70YSgVA/l9SQIHoBkSTqExNjrscb97JuMDn7X+Spb43uQWSTMFFDhC3Pq5MWj7oznmylzylWcbw+/uyWePqPd9TShccW007hi2mn7/bcV5UtZUb50v+NHlszhW7Pn7He8OlDBffWXZnv6GZHO9mgY7neJVsSXas4d8/mMNkaWsnmyex0v9W9mQMZHvdcpnITBkpJ6PlixPGOdVSEyqeM6QZ7pWc8V277Drngbue1JKu5q+TWfnrGCu+ouKehT6onuNdzb+jggsJXN8vB87qn/GJtjLVyz80EGbWdZMjNQwbdmX0GVf1JBbd/X+jjKtX1MeB731H+soPtG32xbxS87XkQXOray+UjVCVw1fUXaz28Y3M3nd/04ye9KvjPnUwjgv7Z/lxajCyEEIS3AffWXFnRJ3WVF+OS27/DbrtWgcqnydZZ9y8Lz+Nm8q1lQoOLKkTBuE6TJ6OCT277D7vheAnnk9CWSB1p+y/yiGfzHtDMKdl5/6HqN57rXgRYEJdkWa+Pm2o/ySv8Wnup8BbQAifeAq6vPKvAEWcvfk2xvibbyhZpzmOqfXJDfVyge63iBl3reAs0P0sRGZpwgL/Zv5qnOV53PoxBC55rqD+LXdB7teA7vxiZNzqk4rmATRKG4qekRftvxAn69KK8ynTX9jfy/7d/jyYU3Fqy8fTjG7e3pd12vsjvePuLGYjZwXng1frz3r84ufYGgCw00PwHNj6b5CQifOx2Ed9yv+Qlqhd/t9SXZ1sfJhl/4PBtofufvGTCS34lL1eceS/xWIau19xjd/KrzJXS3nCYf+PUgL/Rv4tXIOwU7r+EYtwnyTmwPY3171oTGHrObXmugMCeFu9Z2a5KkNDGUhUC42R/Tq0kaj76FZNu2a7vQGQZT2Sm1WKayM35eZvDbco8lfivb1Gg2aDW66LUGvKLJfCAQWNJke6y9YOc1HOO2xLIKkGoVCKRSBR2YsyqOZnOsBYHAVpKjw3MJa0UcUzqf0yuWE1NOV2S1v5x5RTMKZhecF+hN0SZwbS8Lz6U8Q/lGrhAIzqs8wdujsZTNRytPyPid40sXcEblMUSliUJS469kTtE057eqTqbV7EZDENT8HF/aULBztbzOwrGOrXK7FMcH4zZBDnaZczqsLF/GyvJl+x1fFKrlqUO/fFBsFxJXzVjBVTPSv3MMx+HFdfxp4ch+Pzr/mkKd1j8tDl6S+p8EAzLGN1pXsdvoQAPCeoirZ6ykOlDBD/Y+y9rIVme3GcFlU9/LkSVzeKJ7DU92r0EIDakkKwo8MWwl+dHeP7N2YBu6cDYVP+HazhUtRhff2POEV+BYG6zi6ukrDkp1xD8iJibIKNg42MRNTQ87baPuTvhhxXWcW3ksN+9+hD3xvU6HozRQCL41ew53tfyGF3vXg3AySW9HWzizbOmY1tvJ6LOjfGn3Q+wzukBoIA1wbeeKP3Wv496mx7wsliZ8vHfy4Sw/AL3+/wyYmCCjwFKSoObHUm7bKwpbSaRS6EJH14LoQsOA1LWwFiAg/BhuT2Ah2V4UyilR0QKebZXnOtxGOeeq+VE4PhXi/fFfBRMTZBQ4pSE2tpJOOlLZXl2apWxsZbt9Bra3G20pCcrGQnP+PUomKfdzStiW+9nOFTJxrkp3Kgwg7/qtf0VMTJBRUBuoZEnxLNrNHqd7T9NpCNUQ0oIsD8/jtYGt+IWOVDZLS+YCcHxpA03xffg1H6a0WB6eV9CCvWItwPGlDawd2D5kOzw3r986tLiWQ4pnYkqnF2Wav4y6QFXBzvWfHRMTZBTUBafwt0W3EZWGkz7VdMp0JzX76Pxr6LejCOGkWCt8pQDcU/9xvlhzrpfFLPOFC3pOIS3AL+Zfm2RboyJPGydPOpQ1i+/FkjbK/e2xdCH+q+HfboI0G5083fOG8x6BYmGoZtTusrBeNOJFU6T5nYriYfAJLacSlX47yu+7X2PQjqNQTA+Uc2bZURlrtNLZTocWo5OnUvyeyUmTFiIQzoQ/uAQ1/7D4t5sg39jzBPc1PebUXCmbOaGZvLb43rzvwIXAH7pf4+LG+5yMFAq/FuS1w+9hSZp+hnzwzT2ruCeRrVI2s0I1vL7kfu9pOIGRMW4TpNJXylh3SSWKsB7Mm4ZmJPTbUbf2KIClJKayPLKEg4WIHQOhu5kkJxsWU0ZBbfTLmOe3rSQxZRY8eZALyvUSfEInruQYc3s6Zfr43dzGrRbr1MmL8WuBMZWJKGly8qRFlBaw393p7nPKV6TXF3JwszbJ55TcqzKeNpQ6uLmq+uBUjiyZjTWGmjdTWVQHKji2dPz63cdtgpwwaSFXzliB5ZKbWUq63Eij/zGVjWHHWFQymxsK0LSTjLpgFX4RICB8+IXO9ED5mCh2CoEZgQpCWhC/0PGhMcU/qeBLn9pgFX7hVC/7hEZNoILQOPFTZYMizc8ddRdR5Z+MIeNe2jqbP5ayMaSBD42v1J1PTaBy3M5z3JZYGoK76y5hXnA6P9n3N1rNrqw2oAQwSQ9x8qRF3FBzLvV5UN9kwueqP8jK8qO9O+l0f9kBZWQZCWeWH8VLh99FzCXGK/eFmT9G8ujh+OyMs1hZthTb87uc8EH2++RJh/Lkwpu4p+U3vDG4k0GZ3bIyIHzMK5rOp6ev4AN5thRni3F9SfcJnf+c/j4+Oe00uqxIdptZwqHJLOSyatjPowkNlHT3tp0VsKVs3o42E5MOdUK5XsL8UDUAW6KtdNsDCBxqz0NDM/PqAhyUcTYNNmO707PGX8nMYCU+oXNEyewRv7Ml1kq3NXbb4LCnaCrRDuYgk98HAkeH5/LLhuvotgaIZTlB/JpOla9wjWyZMKYJkpkRNcmI0AvWNTfcfq64r/V3fHn3w448gHJkAF467E6e7X2TczbfhRJOcqBcD/PK4XejUJy48Yt0WRGXvh9+1XAdZ5Xnfuf6WusfuGn3Q/g0P7ayWVw8i+cOu4PSNPsOm6LNvGvDjXTZCduCXzRcywfztH3j7p97fi8pmcUrh9/N0z1vcG7jPe4uuqLSV8rfF91WsDbWbMfIKfsv7LKyEG0Seb+DOHT8Ju1mz5hPIh/EpEG72bsfmR1krnhqinegsEm8mLcbPcSU44fhZo4E0GsN0GM78gN9dtT7TUPGaTN68jrnZqMz1bbZw6CMp/18lxWhx316OLYN2oyuvGw3GR1eIYnA6egzlU2b0YMhh/zusQfpsPrzsDBS1AVteRDgFQoJ6YexIKsJ4hMaIS04wt1A8XjXK2M+iXzwYn8jO2LtIy43Mr10D8kAOP/sLwPg/pM08ZKOOn/LMy+Zznbaz7vfSbGdZ1JUS+e3gFQP87MwErO9rvl4uX8LO+P78jrnsSAmTf7Us27EG2jILfLMBll9qlgLMjNQud8jy6f5+WXnS/y68+WsjBUKe81ebmx6CFNaKYOpUAS0ADUZaomGZAAMpIzjc5nAi7UiUBaGNDClgUIS0oLOjUFJTGk4d1pl570vU6IFPdu2jKOjZ+SNShARDNm28s64lWhFDjmdazsgfOgiIX8w5DdK5eXfIUXT9jumo9FudPPF3T8vKK9ANri39XHW9G8doSdfUhfMvtYsq3cQn9BZXjqX5/vegiSDGgJDWly+7TtsjbVx0ZSTmeYvc8gJCgypFFFp8EL/Jr7c9Aiv9b+zH3u3rSSzglNZVJx+/fy56g9wRMlsJE7J+rzQDEq0IGeWH8UjDV9wtfoUU/2TmVdUjQB+03A9e81ehBAUa0HelyeV5mdmrOSw4jqvCnd+UXVGxvTDiuv5VcN17DV7EDi28+G8Arh6xkoWF9cn+V1NkfCzonwpjzRcn+R3GYcV1+f8+0eH51KshzCUlULuEND8PNLxPFFp8MWaczm8uI5AEjFEIWEoi52xfXy7bRXfbX8anzZSMkPjpNLslciylj94pX8Lp2y8CRu530PYVhIbmxn+CuqDU9z0YeG2oQQCU1nsMXvYEWvHUNaI8gaGjHPljA/wzdmXZ/y9ATvm9EEApXrRqIsKU9lE3XeFgPB5ojTpYCtJp9XvdYBU+MKjZp66rYh3ly3RgqOmYGPSpNceAAQ6Iqvar1z9jtgxBqQj7xAQPsozlONYyub0t2/lr71v7nfjAoffuUQPcUjRNKr8k1zWmsJuVXZbA+yIt9Nl9uPXfPv5ZymbmYEqXlt8T9ZJo6yzWEeXzuNDFct5tOPv+wmkOC2nGnvNXvaY3Q4d6DhACA2f0EacHLayqfKX8d/T35fxN77X/jS3Nf8CXeiY0mZZ+BAemX8NxWku+t3xfZzTeDftZq8rVqPxo7lXcXIG1sdrd/2Exzpe8Mrdz686iftnXZr288/1vc1lW7+ZJKQ5md82XJ9W/iAmTT6y5V5ej2xH15xy9y/PPG9ElscEvt/+DLc2P+Y0REmbo8KH8Iv516Sd7LuNDj60+S46zF4c8VKdB+demdZvn9D5XPVZPN+3gYQ2STICmp+4MnlrcBd56MZmByHwoY04QQGksvjP6WfklFHNeoJoCL5afxGvRN5hR6xtxJNITJQDzdgg3S6/W2rPp2GUDbY1ka00x9rQtCBSSV6LKHrtwbQTpMnoZP3gLq9hSsoYm6PNGSfIS/2NtBr70IQfKU1ejbyDrWTaF8O3B5vYHm1F0wIo12ar2Z12ggzIOC/3N9Jp9qEJDSkN1g1sz+j32oFtNMfa0bQAUkmMiE2/jKWdIHuMLl4f2OY+n0BKg02Dmf1eUb6UT047nf9rWzUiWaCGQBO+g8LoYcg47568hCunn5nT93J6WZgdnMZP515FdaDCSw0ebFjKxlIWX5h5Lv81ytMD8Kj8fUJHEw75dqbxEjjyaj736YXQnY3GDHAkCHTv3/ooyyvNOyfN/ZNZ/mBIeiHZRuarTk86p8T3RvPbl6PfAsG99R/n3KqTMOx4Qema8oUj3RdnaXgeP5r76Zx7XXJ+mz5x0kJWLbyR4yctxJAGhiosoVg2UCi3HidOhS/MN2dfwZ11F2eVoNSE5sgDyDhSxhwJggzf8wmNmDQx3e8gDTJfWs4ZYic+H0eNUrHqSzonU8awpDnKBHGkn205ZEOMMpQawrNhyzi2sjPGS8ORPzCTbGSTGg3rRfx07lVcU3M2PqE5WbNEa/ABgsJ5D3Rs23yk6iR+t+CLzApOzfm38tpJP6JkNk8vvJmHOp7jx/v+ysbB3fTZgzkSEOcD57U3oAWYFZzKivKl/Nf09+W063v51FPREG4lr+SokkOo9Jem/fxhxXXcWnsBLUYnAkGJHuS0siMy2vhCzTmsKq5HFw5B3IryZRnvvmeUHcG1ted7maQafyULM0jITfKFuKPuIl4f2I7m0v5c6kovpMNlU9/jLJVcv48smZOxIPLQ4pncXncxzUl+nzGK3wkUa0Hum3UpH6pczv+0/Ym/9W5gr9WL7bKvjC8cfuEKXylHh+fyqWmn8cGK5XnTpmadxUoHS9k0RlvZGtvjZVXGCwpFUPiZGaxkUag2Y1bl3xnJd+t8NxYLiT1GN29Hm2gze7BGeXKNBYkasyr/JBqKapgzwt5MrhjzBJnA2LFhcDfX7voJMTlEe/qN2Z9kSprUraksvrDr57w2sBWfmy69pvpDrChfyrfaVvGrjpc8+YNzq47nqukrWNW9lvtd2QcLm6NL5nFn/cUHRA34nxkT0fkHwIv9m/lT5yug+92tAcXV1WelnSD9dowf7/sLXUavRxy3MFTLivKlPNbxIi/2vOnJH5iu/MGq7rX8tXud22os2RRt4YaZ5xywqth/VkxMkH8ACFwJAuFHCUjoq2dCQPjQNb9LHKe8F2i/0D05AyPxd9zkhHvcVnLiyZElJqL0DwFXgkC4PEFZtMOaysJWFjaaI5Tj9tp48gdCpMgfyIT0gtsLYx7kPvx/FkxMkH8AHF+6gNMrjiHqqtLODFaOWPyXQKlexMemvJtXIu84+xlKcaZbo/XRyhNAga7p2NLio5UnAs4m3tuDu1FCYCmbY8PzmJRB328CDiZe0v+JkXjODM8KKe///yPksP65MeYJIpXkh3v/zOsDO1wqfvj41PdwVF5U/J18c88qBrz9gAo+M+MsivWRy6+HbG9Hd3eGL536bo4qOSStjXUD2/nx3r+4m0k2R5bM4Yppp3kyAFFpIFHU+Mv5bPUHAPha6+9pMbuc/QAtyFUzVuRFFLBuYDs/2fsXJM5G1hEls/mUa/ube1YRdf2uDjh+A3xtzx9oMTrR0CjWAmOy/dO9fyXB63tkyRwum/qenClRpVL8cO+zqeM95T0cFU4/3usGtvFj1/bwmH9zzxMMuO0FNa7f6crtE7IPuYz3WDHmJVaPPciNux9mr9HhZVQUcFQeVPxP9bzhkpv5cKj4/by3bAnLwyPTunRaEW5uetSVIHB2o22lOGpO+oD9sP1Z/qf1N56QZnVwKhdUncSfe9dzb9OjngwA+FhZvgyJIzYplYkjf2CyIFTDZVPfm7N/D+79C99u+ZVne1pwChdPOZlne9dzT9Ojrt+A0FhZvgxbSW7c/TDKs20xP1TD5Xnb/rWXxZoWnMLZlctd/rLs0WX18+WmR2lLjjkq4wT5Yftf3JgHhsX8Te5pesQTThXCz6mTl3BMmvHusvq5pelRWj3bxqjjPVaMeYJIJZ36Hk8GQORdemIr5ZGbKZQrI5ae6MFG4hc6mhZ0yhoYvQ9ZIkELEtCCWO6520jXdsCzraFhub0TqfIHeCXjuUKiPNu2cs7dobGRSRIEQzruEkVA+JAiYVvLn8Xds+0Qx2lCy6v8I7+YD9lOxFwik6QXnG5VndHG27kmhmznf61li4K8pCfkAZwUviMJkA8SVPwJ/tjExZIOyrUtlcTK0rbt0f1LpMvBNdy2QrmTwPmT8E8jVf4gV9jKHsW2ToJZ0aV3w3TlFQpt21L5TfP8Yj6a39Il8ktYKJztsWLMEySshzg2PI+1A9ucu7Fyeg3ywcLimcwJzXSCgMNZVZthvV2mF3N0eC5rIludu5KyWTaKDMCy8Dz+GJyOJjQs9/PFWpCG4hrmhGow3cGa5p/MDH85ElhSXE+b1w+i5834sTR8CDOD09Bcgc2l4UMIaQEWhGYyJ1Tt2pZM85cx1T8ZBRxRMiupF0Xn0Azdkpn9PoRVwWme30td8dJcMTkp5n53vJeN8g6wLDyXPwanen4vC88lpAVpCFVzSGgmRlLMZ2Zol85nvMeKgmSxFIo+Owo4fchjoc/vsiKeFHFYH50fKyYNhzdKOBWo2TTDROwYtnu/KtVDXiFbVBoY0gIUxXrQ62c2lcWgHccplPSNSbR+r9nrPCEUlPvCHkN7Otv9dtTh7gWCmn9MJNuptktG7YxMh3xins52Or/TQaIcfmXGfq1lg6wniKlsnu55nX1WHwJBkQhwZvlRlOohXuzfzPZYG5pwLrVTJh1GdaCCDYO7WRPZihAaypVcXlRcN64OJZDOdqvRxd/6NjhLGSWZUzSNE0oX0mdHebrnDY9ArcpfymmTj0DgJA86rX4S5G2nly3JuIewcXA3ryXZXhaey2EZ/O63ozyVYnuSw22cB0HccL9Hs91nR/lj9zqiyhFym+Kb7FbtCp7qeZ19Vi8gCIkA7y8/qqAslCPHfEnG9uR011oi5pornJrwu8Xo5C+9bzmLVqWYWzSdEzM0fQ1H1hPk9YEdLH/rOkzp3ElRkocbrueciuXMe/2/aYrtcTMLJtfVXsDd9Zfwvk238lTnaidLIQ1OrTiGZw69JeuTyxcKxfvevo2nu17xapJOrziGpw69mWt3/YT7mh71MiqzQzVsOOIb/KF7DedvuhM0nYQEwfolX0MpxZFvXoMhY67fNg81XM+FVSeltX/a27fwbNernt9nVBzLkwtvSkvz83DHc1zUeK8rfwA+LcCaw+/NWf7A8ftW12/H9mmVy3l64c1pv/PQvue4eEvCtiKohVi7+F50oXPY+quxE+TS0vV7Snq/c8UjHc9zYeNdLhGIIqAV8crhd6dlmey0+ln25rXsjLZ419rna8/j3vqPc/rbX+GZrlfd8XZi/qdDv8z1u346lClTkvpQNa8vvj/rSvCs30EStJB+LUiCNG5QxtyOPjslizXoNvrHpOlmL/zu8QPThajAkQ/QgwSED0Nonu2IHfMyJ5b7smoqm0E7BprPy2IJBFEZRypHMHPI77jnXzoMyoRtx++YMskk4unIH/gKIn8QU6kxH43Oc0Am21YgnGWPL+lGIQAD0yNwKBQGZNy1HXRjrmUk0jPcl/LkLFbE/fygjA+NtxtzgIhMHW9byZzkLrKeIAqXQl8MHUlkmKRK5Fxcin01dJyk4wdy0z6dbZV0PJFOdXwj5XgimeL8t+SOuNGTo2qY7dHkDFLPiTFJEwz3OzfbqbIIUimESPK7wOM3lKdM2B4taav2u9ZGGtdkv0ca71zYVLLeRq3whSn3h0mw8AW0ANP95QQ0P9ODZQiE25Svezu9NYEK97iGQKM2B8KusUAgmBmoTLItmOnarg1WoQmfd3xaoIwizc+0QBlBLUCCW7DMV0KZL0yFL8xkX4nnd1ArYpq/LKP92mCVa9nxuyZQkZFFcUagnIBrGxzxofI85A/291tj5ii77jMCFZ7fuH6X+8JM1oup9E0iwccY1AJMD5TnfE6ZMN1fRtB9MoNgsq+EqgwblyVakGmBMs8/TehelrM2OCXF75pABQAzA5VoQnePw9TA5JzI93LKYjVGW+i0+gFBsR7gsFA9PqGxx+im1S3F0NFoCFVTpAXocXmKEouL2cFpGYnSColOq593oq2e7Xmhaip9pcSkQWO01WNYr/ZXMCNQjq0kW2KtTrmHm2FKdKRtj7XTbUUQAkJakPlF1RlLNNLZTgdbSRpjre7LqkOcnW83XK62LSXZEN3lZumcyZlghtkea6fbjrjJiSANo/idKyxlszHaxICbpUu2nQ7prrVcxztb5LQPku7kFQpTOus6v+ZLOu6w3SnlcMwmZuKgjLN+YKdHlDY7ODUtxc1o2B3fx474XsDpkVhSMotiLUilr5TK0oYRzhX3vcPyHvAACOd43PVDMrQhJ5HOuSrwZyE6k852Or+FENjK9tLbUh+6Z22KNtPuMiuW6iGWFM9CFxq74x3siLcD4Bc+jhjF73S2fULjiOKRX4olyk3BOjYST7h0Mc8VPqGzpHjWiP8t2e+wHuII12/lnpNwzymBjOONjSkt9/0ut2XimDcKB+wYKzbdwVuDu9zSEItb6y7kizXn8l87vssv9r2AX/NjSpMPV53AY/Ov4et7nnAkCITPo+L/26LbctYE6bOjnN14N+sHdrq2TW6pvZAbZ3447Xfub/09tzQ9jE84MgBHlMzihcPu5M+9b/Lhxrtd/nNHxOblw+5Eojhxw5fosvrdRzg8Nv/avIRbvrbnD9y8e8j24pJ6VrsSBB9uvAdwBrDMV8Lqw+5CAu/e+GW6rH5P/uCXDddyRtmRfHDznUkxN7m17iJHejoNhsd8cUk9zy26I+0+QmO0lZM2fJEee8Cz/auG6zh18mI+1Hg3bybF/Cu1F/KlDDHPFZujLZyy4ct020Mx/1XD9Zw6eTEf2Hwnbwzs8K61W2ovyDjeD7T+npubkmM+i7/ncK2N+Xk5KA32GN3OCxASW1m0xB3a+ZZ4l8MF6/7TFO8AHAkCW1leScUeoztj9iIdBmSMdqPHLVNwbCdspENTfJ9nW6JoS8gfGD3E3GpahaLLjNBjD9BjDdBjRbzjMRmj3erOPVBAc7wzxe82o4e4NGkzuom7VcQK6DD76bOj9NoDdJr9JLQ7YjJOm9GNpWxajM6kmNs0j+p3asxbjW6iKn3Me+wIHVafd9eNyThtZrcXq5SYG5lt54pOq5/u/WLeS0w5scppvI2OlPFuN3pyysYVpBZLG07R71HrJ1P2j3w8QcWfX+eCSGs77TeykAEY+tzQd4QauwRBetupv5v8Qq+5S9ORYjhWv0fzYyi2JH03/XgXCgkbMtlG0vGxj3f25zvmCRJw2QltO4YtNFCmV+MTEgGQMQycds8Sd51amqDiVxLc/uh8ZMWC7vekHcPQdJBGWrWmBEr1kGMbQFn4RBUBoQ/JANjOIsuvhwhpQSetqMC03Y1C7LwlCMKe38592efGzrFtYthO4Z1PDxLU/F6qcsi2okQrQkcQ1Pwjxjyt31qRQxynJCAJiMqMMQ+52SXTTtxtJSVaEf6RYl5gEdRirch5r02JedBlevQh7ahr2xp9vBMxB5A2PpFZcmI4ClKL9ULfJhqjLQgh0IXGaZOXuNv/TayONHr3oOXheSwqrqPF6OKpntfdKk7JwlAtJ006NK/78nN9G9kUbUZDQxcaZ5QdkbGhqMXo4tne9V7VbkNRDSdOWki/HWVV91qPvG2av4z3lx0FAlZ1rWWPmzkJ60WcVX50XhqKLUYnT/W8keT3TE6etIh+O8rvu19jwI6hgBn+ck/m4I8967yX1YT8Qake4oX+TTQODsX81MlLvNRmOr/3j/nCtE8RS9k82bOOPUY3AijRi/iA6/fw8R7Ndq6wlORPafx+ru9tNkWb8htvpWgIOeOdLca9WLHPjpJg6fhH6YFOLlacpIe8iyQqDS/LU+zKMmdCTBp0WQOAQx+aKNqzlGSf2et9bop/Ut7Cm6ayvCqAgBgqlEwXc0vZ7DP7kmxPLrheSz7FqXvNXq/XoyKpWLHTihB3/QvrIa/WK53f6ZAp5unGOxuMeYkVkwYf2XKfQyDgkpjdWnshn5x2Ktfs/DE/3/c3fJoPS1pcNOVdPDDrsrGaHBO+3/4MNzc94iwfkBwXns+vGq7j1f4tXLz168SlhURRHSjndwtuoDZN+XVUxjl/ywO8HNmCDw2B4iuu39ft+gkP7fu75/fFU07hvlmX5vyE3OVKL7QYXWjusupn867muHADZzfexeoRYn79rp+Na8yj0uC8Lfd5tgWKW2ovGFV64eamR3BI65yY/7rhOlZHtvCxd75OzIt5BU8s+CIAKzd/lVbX7yLNx4/nXp2RWf76XT/h58kxn3oK99dfyg9c28q1fWx4Ho/N/3zWFdljniARO8Yr/VvYZ/ahCw1bxlk3sA04lVci77DX6EbX/NjS5KX+xrGaGzNei7zDnvhedK0IW0lei2xlUMZpjLWwM9qK7tYF7TP7aDY6006QXjvKq5Gt7DN6Pb/XDGzlk5zKS/2N7DW70YXj9yuRd5AZ5A/Sodno5I2BnYBTG2a7EgRLSw7hpf5GOs3+EWK+JSXmqyNbxhyzVL8HeS2yLcnvGGsGtnIF6SfIa5Gt7InvQ3c7KRMx3xJtZUe0Bd195+gw+x19GeDNgV0o9zXdljE2R1tGlZzYa/agC58T8/53AEf2oTVlvLfRaw8euAkC4HP17nShYQvduxAcav7EcS3vZUYhkZA/cDadhojVBMnHlauAlI0Ewfj5LXCapGTiQkmSIBhv2+nPyYmZNoLtdEgbc5Eacx2dRMz9Qsd2Y5Dsdzo4Eg37+z2S7Vye5GOeIJrQsJWNLQ0no5JExa9QbgZBgTTJpUhsvKC5zf4Gwm0Dtb0XPi/bgQL0jGt3jYTfcWzhZHOGGMRdv4XjdzZMiSPBJzS3EsEiQRihu2lOR/4gEXPDndD7x7zQBYaa0JyOTxnH8PweTXohKbaJmAvNkZFIjAUKS/i8mMeVmeR3NpITOFk6Ib2Yp9p2xtt0bWeLMU+QMl8xt9VdwKuRreg4YisJKv7rqj9EQ1G1U2aiVF67z4XG5VNPRSiwXKKGY8JzCetFnDp5MdfUfpQ+y0kq1AencmgovQRBhS/MV2rP55XIO57fn3DZRm6oOYffhWpT/M5lUBJYFKrlttoL2Bnfi0AwyVfM6ZOPoEjzc0fdRSm2L536bgCurT6bhqKacYt5pa+Ur9Sez6uRd9CFhg+NT0zJzLJy+bT3IlCpMdcSMT8vKeZTmF9UDcBttRewK74PIQST9BCnZyE5MTzmAJdOfY/bw66wlc0x4Xk5MblMEMdNYAIZkPUTpMPs5793fJcd8b1oOAVkX5/1iYztnLliw+BuPrvzR15qeHZwGt+d858g4FPb/pednu0ivjHrkywsnsnnd/6Y5/vedvURBTfM/DAry5eltfFE9xrubP4VNo6u4UmTDuWu+ksmyJyHodPs5//t+K739CrVi/j6rE9yWAZhn3RY1b2Gr+YQ806rn//a/j12xNtJFGl+Y9blI473F2d+mBWjjvevPWqnEyct4J76j43a+55A1lfFO7FWftH5Em5pLtgGL1YeX9AJ8lJ/I892vQZ6EJRibWQb11V/CF1o/LLjRff9TYAd55Wqk6kNVvFIx/O0GZ0gdLBj/KF4VsYJ8oeu13ip903Qi0DZNBudXFdzNtNH6fH4d8O2eBu/7HjBawPGNnip8sS8Jsjvu9bwUu9b7rg6Mb++5uy0fTVboq38svMlHCIgAXaMV6tOpm6/8Y7z++JZo06Ql3rXu+MtaTI6uKHmHKZmOd5ZTxCBICB8KOGkHA1N5S1rlQ4aCRkAx05yBibREurYlm4G3iFW04TfeaF15QAyQU/IAAgfFiNLSk/AgU/zIdxRHst4ayPEfLR1fVD4sbHd8fa77RLDx1uO+m6XOt4yK9vJyKHlVmFIc+guLgsv3indzIvhEggkswiOZFvg9JtIZWKgp8gApIPtyQDooGxv53wC+8OSpvsEGdt4p0ovZBfzuDRRQg7Zdl+Vh4/3aER6KeMt7Zz60SGHCTK3aAbnV51Ek9Hh1MfoQU4oXZCTsdFwXGkDp1cuZ8COo5DUBaYwu2gaAjiv6iSajH0uiXOQ5eH5hLUiLqw6iZf7Gz1Z47Mq0j9uAc6qOJrN0Wavceq40gUZsxoDbpmCAoqEn2AakfqRoMDlcHKSjiEtkPLEMpRFVDpJTi3Lko2IHXMLt52cfnKjkq0kERnL+j6fyeac4DTOqzqZJqPDI84+foSGpGzgxLwp65jPC83go1Un0GTsQ6AR1oIsD89zx/tkVvc3oru0P2eNkqVbWb6MTYMJ25JjS+dT8c+exbJcOsnhm1yjHU8ovo6GhNLrSL+VjD/3vsl/bf+uw36CZFGolt80XJc14dqtzb/gh+3P4hc+LGwWhmbyyLzPUeYrYUDGuXDLA7wxsBOfe94PzP4EZ2VYT/+1bwOf2vY/HtFEWC/iF/M/z4JQDZay+eS2/+EvfW8RyOK+53Afa3x79hUZVXvTxTxXZBvz8bA9FmT9BBmwY3xjzxM0GZ0InMKyq2asyEgK8ET3Wp7oetUjMVtZcQwr3SrVjCeVJiC5Hk+HBLnEaPhr7wa2DO5C04JIJYlJg157MKsJolD8tXcDu2NtaJofqSRdVj/tVg9lvhK6rQFWu6U4DtmZzdU7fsDhoTpmFY2s571hYDdbB5vR3KeYVCbbY+0sCNUQsWM837eRptjerHwDkDLO3/vezjhBcoltpvEeKeYtRidf3/ME/W7Wsi4whc9Un+W1RQy3nZC7WDuwzdto/MTU93JkyZy0ttcNbOfBvX/Gdifo0pJDuHzaqVm/T2U9QTZGm/hS08OgLHBlvxpC1Vw+9dQRPy+V4t7Wx3mue61HYrYh2pTVBPlHQaJMwWGAFzkzHfqF7n1fIlL6uhMlG3qiVEPo7Ii1cdXOH/Kr+dcS0PYfmuTzATBQKc1VfuFDS/rvo8HIooQjW0glubf1tzznCYWabIw2Zxzvp3vWuyR+QXAixOllSzg6rdxFP7c0P0prbK+TxZJxFPDt2XO4u+U3vND7BgiHOG5TrJWV5UuTZB+crOX04FQ+VLE8rUDqcGQdHamcDILfpbFHCziSAWnhZJzwPh8kl06uf0cEtAB/6HqFe1t/W5Dfkzjs8On+oKyx91y78GjxUsY78+p9SP4ggF9zmsTMUeQPdBz5g4SNocSBSrGduBEpT+4igOa2MCQTcoyGrJ8giWB7DZBZUPE7tPfSlRyQ405V/68An/BxR8uvWV7awKmTF+f9OwrFJD1EdaBixHosiSKsBflQxfKxnG4KhsY56d8ZMFxyIhv5A8u97mzwvptim9RrzVZqSGLBlV4YlzRvTaCCJSX17DG60dxc9sIMVPya0Dg6PJfGaDN+4cNUFseWzs/h1P49oQmNmDT49Pbv8ZdFt1KdZ6eeKU1OKT+an8272ivcS4ZSENB8BdsHcsZ7Ho3RFne8bZaPkvVaEKqhvqgaQ9lIJDP8FWnbCwAm6yGWhQ9hdf8WfEJ3yLld6YXlpQ1sjbXhFzqmsjjalUU4qmQO04NTEG5x6dLwIUzOoXEv6+jUB6fw6uH3EnE7yYq0wKg19Q/Muoyba89z+W1FTif27wy/8NEYbeJzOx/kZ/M+kxfLOzidePnwVeUDAdxb/3Guq/mQM95oo67zT550KJuO/LbHHxzWQxl9LdaC/GL+tXRb/Sicl/hEF+fXZl3GLSNca1dMO40Lqk7CVBYCwWRf8fh0FJrK5qme11N6lFeWH52xaX7jYBMv929OUIZwXLiBRXmUKmTCc30b2TjYhBACPzrvKz+qoP3RBxJ2UlOVXwvyWMfzLC+dz2ddQc/cIBiQcZpdeqCRoKMx3V9WsBd1XWhM92fPWpjgAUjofcwIlHNG2ZEZJ0mR5mfGCOPr8B9s9hoLEtdai9HFMz1vuHJ6kkNDtTn1pGefxRrczbmN92DIOODsiP58/ue5aMrJI35eobhm1495qnNIguDUimUFlT/osiJcuvVb7Ii2elmNa2aex32zPl4wGwcSdcEqb2NOALrwcUvToxwdnseJOW7K+jU/f+17i+VvXZ9g5k6BAqSyuaPuYi6fNnImcrzxRPcaLmy828k8IQlqRaw+/K608geZ8NmdP+KZ7tfcLJbJGZXL+dPCm/jGnie4t/lREE4d2KxQNesW35e1/EHWt46EyL3fFZtE6BkJuJRSzqNT8zuf1/wFlz+IK8tpvkmck+Z36O7/CWEqmyunr+CUSYdhuHHShUafPcint3+PXnswpz0JgVOu0W700G727vdnr9lLu9HpUYgeDDjyBzoBzY/fXa7nQyDofS/pOkgs2wZlDIRzDWpawKGXzaHcJKdna+qNSKV9dCcwnHq/8Jv2w+n9D6zEQiGhlGRKYBLfnnMFlf7J3i5yQPhZP7CN63f9FKlkTutngfDackf6g9AKTvqWCxLSBN7fGS0xPNpvDWG4BEfq8XGQPyj3hSnzlWBKC0NZ+IWfGf70a30hBDXBCq/NESULLn9QohUxNTAZqSxMtz3zQEksjAfi0qShqIb7XQaUxA3IrwX46b6/8aO9f04hBx8NEoWhrLR/UPKgJk6mB8rxiwCGO36T9VBG+YNMqA1WJV1rNjM9+YMqQGAqC6kspvpzkz/IOtoLQjU8f9jtdFoRwMkoHJ6hF0Qg+J/Z/8Hnqz/oHZsTnJ71iWWDSXqIxxu+4JW/+IR+wDQQxxMfm3IKL/U38r22PxJwN70sZbN2YHvWHFemtDhx0qFcW/PBtCI6fs3HiaXZv7AWGu8vO5JXFt/rLauykT9Ih2/P+RRXzVjh/T3Runt19UpOLVvsyV7XBipzIv3LKQmeu/zx8IHJf/mzKdrsCmkKQlqAxcX1+IROXXDKiNIJHVYfW6Kt3t/nF1VT5Z/EgIyzYWAXtlsTWxuooj5P6YXxgkBwZ93FvBZ5h9cj2wlofgQCXw7LIYVkZrCSs8rz70nfFG2my9WDSY75rvg+N5ngLOEOK6736qdGwoCMs2Fwl6eHnoi5T+gcmeaFPHm8i7UAh7u206HKV0rVCImMEi3IMWlKV7LBuHYL/feO7/HovhccvTxp8hFX/iBXNEZbedeGm+i2Iy4VP/yy4dq0g69QXLnjB/yi4wX8wo+pTD5aeSKPzP8cX0+SIDCVxZEls/nLotuyUm8VcMAarCp8Yf5vzv/jfW9/hT47mpdwzVjexxqjLbxrw4302AMkqKJ/7UoQOJITO5wq5SzkD77e+gdPgmAo5remZdrcHG3h3RtvotOKuHpR8FjDtXxgDJM9X4zbaEslaY53oTzieTkqVX06dNsRR59DuKI8ruRCOigcqQGZZN2TXog5dPia0FFAm0uHP9oE0YSgz45y5Y4fENICIz4LbWVzetkRXJBBATcXHBOey+11F/HpHd/zNDqyhS58DqHbtv8Z8VwViiLh5+oZK5kfqt7vv/fYA3RYfejCEfM0pEmb2UPclT9w6Lezkz/YHe9wxDdTYh5PO0G6rH66zQEQzltYTMZpT6IVPZAY19uhlkQ9P1aafE8qgOTfTI9cpBeyKaIUCKLS5KF9fyftUlGabI21cUHVSTldzJnwH9NO56X+Rh7a9xcCOeyK60JjR2wvW6NPp/+QjDPFP5lbas8b8T/vL38w/Pj4SRCkyjscvDLXcZsgQginb0KZGEqAMjOuUzMh5IpMGtJwduWVpCTDDr4AirWA02qpAdL0Si5K9dBQ26ey8Qtf1nT4Aqc3Ph0MRMGbe3Shcf+sj/PGwHY2RptyWuI56dz05UAGKm0bbUgLoKFhStONuSP74Eg2+IbaXpU1uvSC7kpLKC2rmBe70tNDttUBK5kZjvGbIAjuq/84H608DoGGQnJMOL9ixUWhWn7bcD17zT5XSDPgSBNksH1//WXenVyhWOYWr31mxkoWF9chcZaBc0MzqEizq2q5KcPEnsSoSKQZXSTS24lKUieT4soTo7CSqlFRMu3FOs1fxv8d8p+8/+3bGJCxISZDZad8x0ll2mS9Debqjo+EhaFaHm/4wlDMRYD3lx9FsRbkp/OuYmt0j9fB+e7Jh2c085kZZ7GkuD6rmAMcVlzHLxo+79gGT/7gYCCnCTIg494OpV/o3hoyLk2vF1qgUe4q2R5WXJeWFqjbGvDuX2GtyOv17rMHvYusSPN7d60zyo4k7orD+4Tu3UnT2V5UXJuiFJsorKwOVPDhyhNI6GkXZbgzHVfawNxQbYJ8ZlQYyuIYdyICHBOex1uDO/ELH7aS1AWrKNedC2OSXkxDqBpb2a7ens1U3+S0v31i6UJurbuAO5t/he6u5X1CZ4ZLX1OsB1kWnoupJIEsnmIKp8svXYW1P0PMTyhdyNKSOSSWTUXu2NlK0msPuL/gFAzqwpFkzjbmCVtjyb4VEln3pO+Od/DBxjuHqPiFj4fmfZbjShv44OY7eSUyVIJ8e/3FfDJNpyHAD9qf4cbdDyGEhqVsji1t4LcN17M6soWLt3ydmDKQSlETrGTVgi8hhOD9b9/m0OELzbE9/3McG57H2Y13s9olbVBKclvdRVwx7TQ+t/NBfrrvr17p9cemnMIDsy7j++3PcFOS7eNKG3h0/jVpH+EJbYlsJogCd0I7d/ihC8Z5igWFj3BSMmBAxohJ01tlJy6oTOiyIiS2EH1CY3KSnnpCUyPbc82k7dEU7+SszXfQanYPjff8z3JseD5nb76L1UnjnYj5NTsf5CdZxXwBj87/3EFbNuWCrJ8gzUYn6wd2eq/ItjTYFG3myJLZvBrZSkcSFf/ayLaME2TNwDbajc4UOvyYNNk82MKu2JAEQbc9QIvRhU9ovDm4K8l2nMbBZg4vrmNtZFuS7RhrB7ZxBafxauQdOs0+hw5fWbzS78gArIlspd3o8Ojw17h0+OkGKxumkXTQhZaRQaNEK8pZzi3T0sQvfEzWC7NqbjE7WT+4A5diGlsabB5sYXFxPWsGtqfEfN3AdgBejWyl0+h1pBeUxWpX7mL4eK+JbKXXjv5rTZAEFX+CvC0zFX/me1gyJX3i++ASjCXR4TtUPs60SGc7HRW/niwDkGBvZ386/CEbE0iGcBMOCeK4zDF34pdbzP85kPUE0V0qfpSj2oA00d2UXaoMQDxLOvy4R4dvK4dBb4gOH0Bhu3T4utAc4rjE24A00N0XxFQq/iHbjgyAS4fvrqOHbA/R4duu/MEEUqELDUtaeN3mifFmf/kDMTzmqBFinjre/ywxz3qCHBqayZ11Fzstt24K97SyIwhpQe6ov4g3B3aiu3eGS6a8K+NvfWLqe/C5dxNbSY4omUWxHuDUsiXcUHeRI6SpFDMC5cwPVSOAr9Zf4jVrFWsB3jt5MWG9iFtrL2D94E6PSOySKacAcH312RxZPAtN6Ehlc3rZkYBDxR/QdBTOxF5SMosqf34Fcv/KWBCq4av1H2NPQgZND3Ba2RJK9CJuSxPz66o/xJLiepfGSHJGIuZT30NAaP+UMf+HJI47mEikYYcvu9IdH+23Rvp8IW3kioNpO9dzKtTn8/0O5PAE2Wf2cdXOH3hZrCLh5/5Zl7KwuJbP7/wxr0W2uk8Fxeerz86L/+qtwd1ct+vHRF0u1ppABd+a/UmqsuQwSsY396ziV50vogsdW9l8uPIErpqxgie613Bf6+M4FbKSY8JzuXfWx9k02MI1ux4kJp0MWnWgkv+d8x8oFP+943u0xDu9J+d99ZdmZLX/5p5V/LLzRS99+5GqE7hq+gpWda91KX2cO+nR4XncN+tSNg0287mdDxJXDv9tjT9/v9NhVfca7m19fATbTVyz6ydEXY6pmkAF35z1yax5o7LBfjEvnce99R/bL+Y1gUq+NfuKtE8XQ1ncsPvnvNq/xSuB+Xz1h0aVu7hvmN93138s6z7/rCfI1lgbj+57nuQ16Yerjmd2cBo/2/d3Ooxuh+hYGhwaqs1rgrzc38ifOl9xiMdQaELnyhkrcr5QJIrHOl90KPeFD5SFpZQ3Qf7evc7hbVKSrbE93Fx7Hq9GtrjtwQESuwTXuwQEv+h4Eem9e8U5t+K4jBPk4Y7neaVvg9f+qRDeBEm23Rht5dba81kdaeTprled1mQAFJ+pXlnQCfJE91r+3v26S+om2Rxr5fa6C3nZ89sPKITQuXL6mQWdIH/oWpNie2tsD7fMPI9XIu/wVOfqJA4tnatmrKDKPzIbSpcV4eF9z9EW7/SutYaimaNOkOSYb4m1ZZReGI4csljDJAggRYJAd6UHDFRelaeQJH/g2hlL2YZf6B7tvaGGWBE1NM+GpYbo8MUw28kvkUHNj6U012+ZwmaY2bYfgyHRSp8Ysm0rSVDzj2A7/dJsLNCG2U74PTzm+jjw4CbbHoq5ywqZbJvRbQeED01z5Q9Q2csfuLazLStKIHf5g6QniFTuZFEWtjRdQcnRJQjSwZM/wOmns4Uk3x4SU9ku7b0CZXm78xKXDh8NlMRQFmIE28nNlnFpJj1BRpcBGLINSNPtdkyi4ndtx5WJQCTZTmD0duZc4UkQINL47di1RH5jl7vtZL8duQszC9uGspAJKYVc5A+8mLvCoFki6wkyz5U/aDW7vPKC40rnU6QHuGTKybwW2ea9g+RbN3Nc6XzOqFxOTA6txROdYblAQ3Be5QloOEyFlrL4SOUJgEOHvzna7K2Hj3Zp9ZeHU21X+yuYHZyGEvDRyhNoMROi9n6OHaWm7MKqk/ALbT/b7y8/io3R3c5ejpIsC8+lWAu6sg/HOJoYKGb4KzgkOCNnvzNhZflSNkWbUmwXaX6OC8/nfZXHOO99Y4h5JpxVsYzGWGrMS7Qgy0vmcUblsSkxH6n0PoEKX5gLqk7mtcg73rU2mtxF8ngn/M602TocE1msCUwgAw6K/tjrA9v58d6/eNWdR4bncPnUU2k1uvjWnlUMyrhzNwtUcrXbZ/z1PU94maRiLcjVM1YyI1DOD/Y+y+uRHe7GoSP7e2TJnLS210W289N9f0WisJEcWTyHT0x7b87yYhLFj/b+mdcj292q1ixsD2znp3uTbJfM5hNT01PxR+wY39yzihZjyO+rZqygJoPkxKruNfyxe523F/H+8qNYUb6M1wd28JO9f3FsK8mRJXO4fNqp7DG6+OawmF81/cyM7QTjDUdqY8jvEq2IK2ecmdHvdBge8yNKZnN5hpgPx0GZID/a+xe+3fIbN6thMz04hQsqT+LZ3vXc3fRIUhbLx/vLjkQXGl/a9XOSd9IXheo4u3I5N+9+lD3xITp8Sym+Myf9RfrDvc/yP62/dbMaNtXBqXyw8him+HLL2nRa/Xx59yNJtg1sFN+end72EBW/Y3tacApnVxybVm3p7WgTNzY9hEp6/5mfQXJCobi75XGe73ndI+tbP7iLFeXLeHDvn/lWUsynBau4cMrJPN37Bnc3PZqUxfLxnkmHsfwg8ihvjDZxY9PDqMT7gozTEKrhsqnvyfm3frT3z3yn5TdezKcHp3J2xXKqshzvgzJBJNKjvXfoNp06K1sN0eEnsliWcl6Jh2fQEqQLfuHQ4SeyGqNR2yfbtlzb+SQVpPtdXQu62Ttysm0riX8U207Gx49068UMxCiSE273nkugZjDU7SdRKba1/WI+lMWycpAHGA842SY/tkhkDhW5cbIPYfh4jxbz4TgoE8ROor233UYi2J8OP5HyhPTSC2YaOvxsbA81MeWOBBX/UMOTPerFO9zv5OaqkW0o9zNqP7/TwRomOZGI7egxdyaMZGjX+WAh4bdCZu13Ogwf73GTPygklpUcwh+CUxBCx1IWx4TnUaQFWBCqYXaohriyvFqsmkAFAsERJbNoM3vQ3MrehuIaSrQgy8KH8GrkHXzCh1K21zmY1nZ4HquCUz3bR4fnMjkHnqQEJukhjgnPdftgXNsuFX86LA0fQrVn2+bo8NyMHE21gUqOKJnl1KAJpyfj0AySEwLB8vA8tkVb8Wt+TGl5GTfHdmrMg66ExexQdUrM6zJIEBwI1AWqWFxST5vZjUAQFDoL8+TLWlYylydSYp6b/MFByWIpoNuKuPsJirAW8rrSeu2BoY5CEfD6MSJ2jJga6mZMNArFpOlIMginMHu0FF4m27liuO1yXzjjq1+KbaUo1UOjquYmuGQFToNTNiq7yfy2yT0XCX5lGOrzB2efJ9G8GxS+gyqamUCq3zrBHBglh6Mrx5gnYyLN66LfjvKH7jUM2nEUimn+Mm8/Z1X3WtrNHhLy12eVL8t4598wuJuX+xvRhEAqxXGlDRlLU9LBUjZ/6nmDvQnbWpAzy4+iVA/xXN/bbI62oAunBP30siXUBCrZOLibVyPveGKWx4Tns6i4llaji2d73/TUZueHqjmxdCH9dpQne9al+P0+twp3Vc9a2o2E3wHOKj86J1bC0ZAp5n/qWUe72evF/Myyo0aN+er+RoQQKKU4Ns+YD8fEBHHxSMfzXNh4j1O7hSKoBXl9yf1IpVj21rXE7BggQFk83HBdRu6r09/+SgoV//sql/PkwhtzLh95fWA7x791AzEZd21LHmm4lnMqj2X+uv9mV6zNqUlSJtfPPI+76i/hfZtuS5GcOL3iaJ469Gau3/Uz7ml+FIRTDzUrNINNR36Lxztf4YLGe5xMHIoivYg1h9+DLnQWr/8spjRc2zYPNVzLhQXi/IL9Y16kBVm75D4Alq7/fJLfo8f8jLdv5enuV1NivmrhjTmn74fjoLyD/CNiQMZAaF42R6GIyrjHBu536T8NaWeUfXB+K55SizXoVquO1mk5HFFpOJk6z7bJgIxhK0lUGUP1b1J5sg/RhG3Nte0uSyNJMgC2ksSUUxI0st8GPk1HYuPXAgjAkM7+RCHhyB+IJNuOz+AsR1NjnlkWYUDGnGyV8Lkxd3qKyDHmwzExQVwkHqSJiyT5uSpVcm2UGkmPZoTfSsrD5fmQVq5tRJJt9zyU8s40xUY628nHVfJxUv1OJrqWSiGSbRd4seH8nEprW4kDH/Ph+OfoezwAmB4oJ6QVOb31aFT4w5TpJZT7wlT4wmhuj3VIK2ZaoCzjb9UFq9DR3V59nZpAxagVwCOh0hem0l+KnrCtFzHdX45P6MwMVKIJzSNymxl0dplrApXoYsj2THf3eWawEr/7Aq4JjepABX6hM91fTkgvcisRNCpdmYtJejFTfJNc2zpFWpDpgfKcfciE6YHJhLTQfjEv00uo8IeH/NZCTA+kp0QCqA1OQUcbinmwMq+YD8fEO4gLS0neGtzlPuIVFb6wx2a/LdZGtzWAAC8dnamkv8Pq550kZvl5RTPy7u3YHG12qX4chvXDi+vwCZ1Wo4tWoxshnOxWQ6iGkBag24qwPd7u1STPCU6j3BdmQMbZOLjb22OaGaikLjgFS9m8Nbi7IH7nCltJNkdbiEkDBZT7SjikaHpGv9Oh24qwI94Ow/weK3JaYr0Ta6XPFVwMCj8LQjX4hE6z0elkO1w+1fmhakq0IJ1WPzvje0mwG84KTqXSV8qAjLMl2uo96qcGJlMbqMJSNpujLR5ZWakW8qo734ntoc8e3M92k9HJ3iTbDaFqijPYHpRxGkew7RNaWip+XWheKji5E63Z6KDd6B3yu6iaEj3oUvHv3/Szv99l1AYq9/N7kl7MvCKnmjed5IQmNIo0Hw5d3tCd0tk38HsTJJEYSCcDkEmCIJ3fTUYHe5P9znO8E7+rXBvJky+d3+lsCwSBEfweK7J+gmyOtnDShi85LOs4bCa/bbie08uO4Og3r2P9wA58mo4tLe6ov4Qbas7lgi0P8GjHc/g0H5a0+GjVSTw2/xq+2vJrvrTr5/g0HUtKjgzPZvVhd/FM75uc03gXtnI4F6t8pbx8+F1oCI5+6zq6rYhjG/jtghs4tWwxx731BV6P7MCnOSwct9ddzJdmfti1/bxrw+a8qhN5dP413NH8K27c/XP3nGyOCs/hr4tuy0jFf/KGL3laFbqA3zTcwKmTF3Pchht4PbLdtW1ze91FGWUA7mj5FTfuStiWLCmZxauL7+Hpnjc4p/Fu712nwhfmhcO+mlZMJiJjnPjWF3OKea7YEm3l+A03eE8QZ7y/wGllS1j+5vW8MTAU8zvqLuaLXsyf82KbGvOHvPE+KjyHlw67k2d73+TsxjuRynl7qPSV8vxhd6T1u9ce5D0bv8y6EWJ+/pb7eazjBdeGxflVJ/Pw/M+OeaJk/bzssiL02ANO5apwSI33GN0Y0qLN6EFzOZQUiuZ4JwAtRhd4l7QYkiCIdwASgfNbbUYPhrJpM3swpOFxLvXJKN2u3V5rcMi2Mmk3e4hK072bJFQkJM2GY7vZ6ATh2hbCO6dk20LotBu9GTMknVY/fTLq2TakQbvZg6Es2o0etCTbo8kAOOcw5Pdes5e4NGkzejCl6drQ6bIdn9MhLi2XZXKkmHemxLzFjUeu6LYjdFv9KePdZvYQlQZ7zZFjnjLeImm8jSG/hdBoN1wZBasX0x1vTWj02lE6rP605zQo4+5KJTnmSeMqUv1Op6yVC3JquRVJ/zuZ9t6hwx86riUdJ+l7qceHvpP6OZFkJ2npINjvM4nvjt12+rtM4tPJNpJ/M+X4KC+Faf0W6f1Od065+p0PxHD/8rQtchjv0TxPF/NC+p2MrCeIQ/4sML3NG5sSLYjPzZjY0nCJ4wyvvKFI+IeI4KThEUiXaEVJLZgOHb4uNOd7ynZlkBWaVkTIrZYFkjatLIq1IvyubSkNl8TMTLIdcGwLh8Qs5B4v0RO2HSp+n9Az9imHtCBKqZQNs2LXb3+K3+aoMgDF2v62fUJ3ZCGUhSGdO55P8zvnnwY+oREQ/jQxD6TEPNPvZELIXdebCenuYeOdGvOi/W0nxTysBVPGO9XvofEOaMGMdKQBNwuXbDvsfj6kBYfG2/W7EO8hWb+DmMrmjz3raDO6AUFYL/JKLpyyh2YEGroQnFF2JDWBCq/kIvHSlii5aDE6earnDWzl1I8uDM3kpEmHeqUHETsGKKYHyjnTlTl4snsdbWbCdtAre9jf9hHUBCoz2O7i2d71jm0laSiuyShk6ZR7vO6WPTiTO1Hu8UL/JhqjLZ7tUycvoSaQXvm3xejiqZ7XPb8XhGZysuf3a0TsOOAUDL6v7KiM1DTP973NphxinitMZfN0zxu0mT0InJquleXLCOtFecQ8dbyT/X6yex0DMoYCpvkn876yIzNmq9LFvFB+D8e/ZZp3UBoot8+kRA+OeqexlE1MOhkmv6YTFE7WRaEYsJ33Fydf79ytbSXpdtWAwZHQzjc9GrFj3u6yX9MpS2JzzxWdVr+7wehUIyeK9nrsAUzpFIgWawGvm9BSMkXuIpciv2wRV6Znu0jzj1oomYi5s1QbinkmdFn9bgIk1e9s8G+3k/699qe5tekXXnbrqPAhGan4d8f3cXbj3ew1e9EQ+ITGT+ZdzbHh+ZzbeA9rI9u837q59jyumHYa1+76CY91vIBf82FKi/OrTuS+WZfl/MDfFd/HOQnbQuBD50dzr+Rdkw7N2e/vtz/DV5ofc5rQXL9/03AdL/c3cunWb2FhI5Viqn8yv1/wRTQEKzbfTofZhxACHxoPzr2Kk/OwnQ7P973NpVu/iYX0bP+24QvUpdG6H5RxLtjywFDMlc2XZ36UT007Pa2N77U/w23Nj6ILJ7N2ZHgOv5j/+awmFvwbTpA1kW20xNvQtCBSSWREZaTibzI6edOVMBYIpIzRONjCkuJZvBrZSpurWSKl4UkvvNTfSKuxD034kdLk1chWtwMxt6dIs9HJGwM7SXRSSmmwabAprwmybmA7LbF2NC2AVBIj4pSTN0Zb2B5tQXO7OPeYPbQaXfg1ndcHtuNSiru2mws6QTZFW9gebUbTihzbRg9NRkfaCdJnR3ktstXhC3ZjviayjU9NG/HjAKwd2EZzrN0bbzui6LUHJyZIOuhCgPuSaOE0X2W6s4ukzwgExn6yDw6tvzFczsG1YQiZNxlbwrZ0O+uSbecKLclvmyEtReFKEyRodHS3vXe4/MFYbKc/p2G2GV2KwimVcb6THPN0yHW897OXw2f/JZBKxe+0nmYqifYJjZg0UcokQRiR6MEYkn1waDCH2BgV2HEMzSEtUyo7har9bKMRlyaQIC+wxsBamfBbuS25jt+6JwfhNNtawmEt1EiWP8CRPyhQ6jSB4XIXpms7vQ8Ov64jveDGfJR4DB9vU1mOz1ni326CXD7tVIQQXuPQUSWHUJVBBWpRcR231V5Ak9GBcLN37528mGI9wFdqz2ftwDZPzDLBuvGFmnNYVVznUe+sKF+W1913UXEdt9ddRItru0Qv4oyyI/Ly+xNT3+NUzLp+Ly05hCLNz2llS7i29jwG7BgKRU2gytvJvr3uYlqMzjHbTgfH9gVJtiszZp4qfaXcXHs+65Ji/omp781o4xNTHUqnBN3RUSVzDixxXLPRySv977BhcDedVp8jslOA/PNI0BCU6kXMKZrO0eG5HFEye8wNMcORoBUt9O8eSNvJpAsHWs7gYNoeD+T9BNkWa+P+1t/zeNcr7DG68DirDggUxXoxy8Pz+MyMs/hAxdgVUTcM7ub6XT8lrkyUgumBMr4x+/Ks+ZPGavu6XT/FSLL9rdlXAHDVjh+kkDbcXf+xjHfZb+1ZxW+6VnvSC+dUHMuVLvleOtvX7/qZ67dKsX3lju/T5haCBoWPu+o/xuEZbT/Jb7peTrJ9HFfOOHMU2z/1CCPGI+ZPdK/h661/QAiH9vSokjncVX9J4eUPkvHLzpf43M4f0Rzbh+52rx1oGMrir71v8VzfRq6Ydjr31n98TIKbL0caebLz5RT5gytnrKAqPP4T5MX+zfyxc3WK/MG11WcjkTy07zmGCPNMPlBxTNoJolA82vkiL/W86bXcxpWVcYK82L/Z9XtI/uBzMz6AT9N5eN/f8Mr1pMkHK5annSC2kjzW+QIvJmwri5g0M06QlyNbeLLzJU/+QKDz6elnUlVa2Any5+7XPPmDTdFmrqv5UOHlDxL46b6/8R/b/pe4MgnoB0+lVMNp1ZQo/m/Pk+wze/npvKvzVk4dLgNwIDX0RpY/cBDU/ENZLEZffnnSC1qq9EI6ZJI/8Gn+oSxWrraTJCeytp2F/EGuGC5/EBgv+QOA1f1buGrHDzCUhT9HQ+MFDYFfD/LrzheZXTSNe+s/ntfvSOVS8QuHih91INfPCdtuN4PzfyicJ6VKPEFUltILysRQzhMnQRCXDnKY7WTyO0tabiWlcIWAMtu2PNmH7Gwrz7ZDGDEejI6e/IHQnbovV4oiW2R9lRvS5IbdP6fXihAYYZPFYwEcJShjg+btOyRDAD7h59ttT3J2xXKOL12Q8y8fV9rAaRXHOHVBSlEbnOI1LY03ji9dwGkVR3u264JTqA9OARQfrTyeXfF9HonzCRl8EziyD1LZnvTceZUnZrR9QpJtqRT1wanMKZqGQPDRqpNoiu9DCEGxVsTxIzSBJaALjY9WnYiVZPv8URhQji2dz2kVy1P8ziR/kA9Wli9j4+BuEkyYx5UuGJ8s1p96XmflptvdHoRUmMrGL3SWheeyMFRDUZa7lLlAKkmr0c3qyBbaje4R33sMaXDhlHfx0LzPFtz+BP49kfUT5Dedq7GVtd+usKks5gSn8/XZnxi1ErMQ2BZr46amR3ik4/n91pO68PHX3g3sMbqZUWCCgeGwleSHe//M6kgjGhp+ofGpaadzZMkcnuhew+Ndr3iVpR+qWM7K8mW8PrCd77U/4/AJIzk2PJ9PTTudVqOL+1t/T689iEIxOziNz844i5I83vGe6F7D77pexXmuKj5UcYwrf7Cd77U/jamka7uBT007jVajiwf2/J5eaxDp2r6m+gMA3N/6O3bE96IhmKQX87nqD2SsVs4VLUYXD7T+nj47YXsq11R/EID7Wn/Hzng7AsFkvSRv268PbOf7XswVy8Pz+eTUU7PuF8lqghjSYv3gDpdcbAi2klT6Snl0/jUsC2fmpS0UDimazo/nXsmgHed3Xa+kPEk0obHP7GVTtGncJ0iXFeGWplTpBZ/Q+dbsOdzV8hte7HnDyYhJg3dibawsX8aDe//K/7U+7lHx/zG4jounvIune9fzQPMvvUwSaLyv7IhReYaHQ6G4p/Vxnu9e59neHG1x5Q/+wv+1/s6z/WRwHZdMeRdP96zn/qZfguaQt2nCz8rypehC46bdD5Ho8EaaLCquHXVjLhc83fMGDzQ/5mUOhfBzlpuyv7np0ZTqhcOK6/KSP/jh3j/zv0kxfzK4jnMqlmdNopHVBIlKg3azd7/Mjq0sPjbl3QdsciQQED5uqv0If+5dT0xZXnZF4DzR9pg9434OkpHkDxIQoAdd4rihPjlFqgSBz6Xit1WCon8oizXay3g6OBmx4AjyB7jHE/IHmicqs5/8gZJOBa/mS8pijS69kCtsLx5BL4tluSzuqfIHjEH+YCjmnvxBDsmArHKZNpK4NPd79xBC47SyJbmcb8FwWKiOOUXTsUdICiR6GMYTyfIHQxT7zrkMlyBIHLfdJMZw+YNk2YeENEG+EyS9/IG9n42RbCfkFhRqP//ylSBIh3S2cRM+hbCd7LdUo0tODEfeuVqFIiD8OVHJFxI+oVPuC7v0kgfe/mS9mGPC83g1sgWf0FFKsqzEWRIdX9rArni7J+J5TKlDt3NUySHUBKchhObJH4S0gCdBYCjL20mv9ue+RHTkD+azPbbHs+3JH5TMoSY4Ncn2kPzBnFCNV0EwI1DGjEAFAjiy5BCXJMF5ai/MIL2QDxaEapgTmklc2SglmR4oZ4br95KSetqMboTQCAqdBWOQP1g1LObpGGxGQlZZrC4rwqI3rmKf2eelWBObaX9ddCvHZUj/AbQaXbQYXaPmxRMo94U5pGh6xo0mW0ne+/bN/L13Q8p7iCENfjD302llygoJiaLPcri6fEJP2clPvHg6L5lDA9Jvx7wnyiRfsbc8jErDrdx1uhzz3WeylE2H2Zd4c6DKP8lLnORq21SW1zEZ1PxZ91DkgnS2++yoIy2BoyycS2p2OPaavR5hXoUvnFOWdVx3+7qsCDftfphfd71MjzVANrd6hcIvfBxVMpvb6y7k5EmLCnpOLUYnf+p53VEaUopFxXV5NQEp4KX+zWwabPY67k4rO4KaQAUbo0283N/offC40gYWFdfSYnTxTM8bWEiUUiwonslJrgTBqu619LukfDMC5bzf7cVf1b2GFld6u1QL8YGKzBIEPqGPSBE63PbC4pme/EHCtgKqk2w/1fMGe4xuAEr1IlYkcRBsHNyNEM5u+RllRzLT7Ul/oX+TZ/PE0oVeT/ofe1531LySYj6S7UQmdJIeYlIOUgvpbANM9WemLc2EcZsgcWly+bbv8HjHC+ha0E2rZbeujiuT5/s2cm7jPTy58CaOzjGbkwlfb32C+5of9cQsZ4dmsmbxfTnfobqtCB975xvsiDa7WSyTa2vP5576j/GZHT/k2a5XvXqoMyqP408Lb+Kbe1ZxT9PDnu26UA2NR3yLJ7vXckHjXSQkCHxagLeWfB0bxUe23IchE9ILkp83XMtFVSfn7Pc39jzBvQmBVM/2t1nVvZYLGu8Gt4IgqIVYu/g+dKHxoca7sBNsLtLm0QU38IGKo/n41m+wM9pCQrz02toLuKf+Y3x+1495KlFTJi1OqziGpw+92bX9mFuj5cR8wxHf4I8967ig8U4S8gcBrYhXD7+bJWmYHjPhczsf5JmuV51snDQ5o/JYnlx405gro8et4OhPPW/wu87V+F1iZJHDP06dVYAOs4e7W347aolDLuiXUS9zomlFnpJRrjCUhalsdK2IgBYELeBJEAxKw8liaUHQgh7pgkfRrwXRtSJsZWMqO0maIIhfK0LhqFd5hAma+1vCl7cEQUTG3CyWY9tUFjYJ+QOfazsIwpFQcNS8FH7PPz8DMoapLCwl0ZL8HvCkF0zPBnrQU7rql/H9Ym4pV9IgybZAjCpzkA6DMr5fzAvBRzJuE+Tl/s14Iox5QhM+1g/uoNdd5xcCw2UAEvofefySRxWarwSBHOU4kNZGYfze/7gaxbZKczxXv4einmo730v6n07+oF86L1hjgUAQl5ZH6lwI1AanoAsfTlOpYFqgzCGyyxHFWpDpgTL3iefUiCUkCOqCVe7vO/8kdoBnBis92wLB9EAZQc3P9EA5QS3gHa/ylzJJL2ayXkKlL+zZGIsEQW2wCl3ono3qQLkjfxAop0gLus9tR2exzBdmsl5MpW+SZzuoBZgWKKdI8zMtUIbm+e1jpkuyUBOoTPG71j1eG6z0bGsJv4Wfab7JFGlF3jmV+UvSasZn419qzA+g/EE+WaxP7/g+39mzasTCxmxhK0l1oILXFt+zX/1+vlmsQRnnrYFdmNgoBfXBKWlZNEZDq9FNs9sO6xMaC0MzKdICdFr9bI62kChbXxCaSaWvlJg02BRt8fL9MwOVVAcqsJVkU7SFQXepUukrTZIBaGGf2UuCMG9x8ay8+tLT+W0ryZuDuzyyvin+yV5KNZ3t3fEOdsX3IQT40Tm8pN5j1B/yW7AgVJPkd7Orea+YGaiiOlDuSU6MZDtX9FgDbI3t8bJ3hxTNoNyXP4dYAv8YNesHEMVakOWl8/c7nmmwUi+UIg4vrs9ILlDpK81YdZsLFoRqRrxomuId7HQvUh86i0tmUZzhZpTObz2D7EM623XBqhFvKrn6nUlyIteYjxf+7SZIOvyxZy0fbbwXhUAiKfOFWX3YXSgUp2y8kS4r4i4FFL9suI7TJi/hrM13sH5gp9tiavKV2gszyh/cv+f33Lz7YXzCj6VsFpfUs/rwu3m65w0+3HgP4JALlPmKeW7RHWnvpgMyxlmbv8qGwd2e7VvrLuKLNeeOU3TGhvtbf8/NTUN+H1Eyi78sujWj5MS7Nt5Id1LMf9FwLWeVp2+t/s/t/8cvO1/CL3yY0uSjVSceWPmDf3W0Gd3EZByJswzoNiP02BFHfsEacF4ukcRkjL1GL4ZyZB8Sx21lZyV/YCvLs9Fm9LjyB93EpeEd7zD76c0gfxBz5Q+SbTfHM9s+mNgd73DoelwP24yeUSUneszUmLcZPRltNMU73N93/jng8gf/6hii6E+m7B/6b0INiSAk/pMmhlLT2cgfJNtIiBCNZHu0l8uEhEAutg8mRvY7/fkKEtIL+cW2kPGYmCAuHEkGyyFWQ+HXgoS0IFI5aclk2YdU+YOYJ39QOko2LKwVJckDOJ13fqE7x5WJIR3yNp8WyFgOoXvyBzFP/mA06YWDiVI94bfy5A8CGcqIStzq3qGYW45UQgYUa0GXrM9p+w1pgYJMkokJ4mJF+TJ+vuA6t+xBUeOvYH6R0/7564brHMFMoFQPcWb5UkJagB/PvcorufCh8/7yIzPauHrGChpC1SllLkVagDPLl/LzhlTbi0K1aX9nkl7Mw/M/m1LmcnqBSd0Kic/MWElDqCal1KRiFLK+kWKeCV+b/QlerjrB+/tx4YaCcJtNTBAXk/RQ2hKOM8qOGLFo7+RJh45Yx2UpSYfZ66UcEwWDNYHKEdPPpRlsjwSB00t+WMipNdKF7tylyVysOFS0BxW+Eu8p1WVFvF37Uj3k1Xr121GvPswpGHQu6pg06HL1InWhjVrrVBOo5JM5FI/6hJ425umwKFRLbaByxALRf8hixUIVhxxs8ZLdrgTBnqTS69FkAK7b9RMe6XjOKzm/cMq7uK/+0gLczxzEpMFHt9zHa5GtXqn9LbUX8Mlpp3L9rp/xcMffPdsXVJ3MA7Mu4wftz3BL06Mp5e6/abiO1ZEtfPydb6aUu/9uwRcRwMrNX00pd/+pK/vw0S3381rkHc/2zbXnc8W00wrknfNSf3bjXSnl7qPF/JqdD/Jwx/NuVs/iwqp3cf+sSx3Zh2F+Pzb/moPP7l4kEu2j+cOp7NXGvc89E5qMTtYP7kK68ge2jLE5mlkG4KX+RtqMLnThx5Ymr/a/k5f8QToMSIOX+hvpNPvRhYYt46wb2A7AK5EttMW70DXH9urIFgDWDmynJb4XXQtiK8nqyBbiymLTYDPboy3orvxBu9XLHqMLn6bz+sA2NFf+wJYGmwdbWFxcz2uRrbQZPa7tGGsGtnIFhZsgzUYH6wd2kShVcmLekjHmL/c30mZ0DsU88g4A6wa20RJvd2vfJK9FttL3jyB/sKRkFmMtNZHK5pCi6WNSVRorEhIElvu/7SxkABz5A0ep1xZa3vIH6c8pIb2QsDFcemHIduLmoruSDCmfY0iCQE+SP0hkg5LlD5L99rv/e8h2oW9gwm2NzT7myf4lxzz5uGJ0Ir3hGLcJclbF0SwLz2NNfyP+LGTOhsN0xT2vmr6yYHfefOATjgSB9AgEzCzo8xPyB46gZKL0olAQCEcMRsbdLFbc+32HjM2VOUiqaNUgSQbAaWEdSf7A9uQPRJL8QcJvp/7K9CQIdFf2obApZp/Q3CVfkuTEqDZcv4X0Yp6IleOfk4E0lf2PIX9Qrpfws3lX81/bv8vz/ZvdlF2WEDo1gQpumXk+Z1UsG69TzAqHFddxS+357Ii3o+FQ0IyWMfpCzbn8LjQTECgkZ1csL5gsMTgJhdvrLkqiHNI9xo9rqz/kZt+GaH8ALpv6Hiz3ApEojg3PJ6QFOL1sCdfUfiSF9ichf3Br3UUe9c4kvZjTypYQ1ov4Su35vBLZ4rBaCp3LC8h0Ak7Mb609P4VyaLSYX19zLgvcmIPigxXLAUf+wE7ye3l4fsYM2nCMe8utoSxe6t/MjtjerFtuK/ylHBuen5EH6R+h5XYC//oY9zRvQPg4ZdJhnDL+JOlZ4YnuNdzd8hsSrCQnlC7kzvqLcyY1zoRv7lnFIx3PeRScF1adzJUzVrCqey13tfzas31c6QLuqf9YzuviXGxfUHUyV81YwaqetdzVPGT7+NIF3DfrUjYNNvHZnQ+mUI9+e84VaUWFTGVx3a6f8XL/ZvcdxXlirihfyrfaVvHwvhFsD/P7hNIF3Fl/SdqYd1r9/Pf277HbpT0t0Yp4YPZlXlo7G78vnHIyV05PF/NLsu75H8NVITCV5XXLHWhIlNNdl+PS5Q9dr/FCzxugF4Gy2RXfx7U1H2J6lnT42eCRjudZ3bfRaW+1DXzCx5UzVvBk99ok25Id8b18seYcpoyhZzoZCsVjnS+m2NaE5lykXWt5oWc96I4MwPZ4O7fXXcjLkS080/Ua6A5526uRrVw140yq0lTldlkRHul4nnaj02m5tWOsKq5nRflSftHxEqt7Nzq/JU0EgqtmrOAP3WuSbCdifnbamG+JtvKLzpfwSLvtGKurTsg4QR7teJ7VfW87bb2JmE9fwaruNSnjvTO+jy/UnJ21/EFWbyuJjIZKOeZkmVZHGrMyVGjsiu9le6wd3wguZLo7aAk6fOFDE/6CPjkS8CVkAIQPkrS/9STbuvAREL6C7/P4he607w6zrQ2z7XdtexIE7rGANno8UmKn+VMzYyP4nU/Mg8LvnI/7W9mIe44W83zGO6sJUqT5qfSXujM66ctC50ftf6bZ6MzJaCHwjT1P0GX175f+04TOlAy0kjJBhy9NpDRzpsPPBmZCBkCaIE2PrMxOsm274jaFLjFMZ1sOs53w25M/kCamND0KnkwwlOXEzrVhu6Ru2djONuZx93wSv5WV7MMoMc9nvLOaTiEtwKGhmayPbE/Z2vAJnW2xNi5+5+t8b87/Kzh1/UiISoP7Wn/Hd9ufxj/sbieV08fRUJS+K+2siqPZFtvj7awuLTkk7zbPdLiw6iRC7l0sIUUGcGb5UhqjLSlyYGVj4HsaDoHg/MoTCCTknpXN2RXHArCifClbPNuO3yEtwHHhBs6sPC5Fgm1eUfpxrPCVclHVyawb2O7INyvFCrdO6rzKE7yN3WS/zypfxtZoS1LM52aM+bzQDC6YcmKK/Ntx4f2bvZJxYdXJhDS/9w5ytmvb8bvV8/uokkMKn8UCeLjjOS7a8rU0sgMW0wNlrCxfxpKSWYT1ooI1zbunia0kO+N7ebr3DV6LbHX1rlPvv4Y0eF/5UlYt+NKoG0spefJxwL+amGW2yOT3eMc8E/K1nfUE6bUHOfGtL7IhunvEdZzDo1r45cp+ENqI9hUOD+uvG673cv+FwICM8/XWP6TIQH9mxkqqAxX8oP3ZFBnoT0x9L0eVzEn7W+sGtvPjvX9JkSS+YtpptBhdfH3PHxiwY0gUtYEqPlf9AUDxwDDbV89YycxAZVobT3Sv4cnutZ4E9Znly1hZvpTXB7bz4N4/I8Gz/clpp9JqdPONPU+kyEB/rvosAB5o/T1NRgcajgz0Z2acRU2ggu+3P8O6ge3ort+XTn1PRr/Todno9Gyn+u3YTpagvmrGihz9XsrK8rHvoWX9xjJZL+YrdedzXuN9SNR+u6dO2UPhqSmzhSnjfKTqJM4qQFCSsXFwNzc1PZKyq3t4cR3nVhzPzZ78gbMbDXDU7PQXyoN7/8y3W37tCUpOC07hoikn80zPeu5r+oUrQQCg8YGKo7GR3Lj7YXALXZAWC0Iz027MKRT3tDzO8z3rPNK6twZ3s7J8KQ/u/QvfavmNSxwnmRqs4uIp7+KZnvUuqZtD3iaEnxXlR6ELnRt3/xyvnk6aHFZcz4crjuXLTY/QFt/n+h1HojL6nQ6O348OCacKPyvdjeEbmx6BpJgvDM3MKH9wd8tvnEyZSxy3cbCJM8uOykufPhk5ffucimO5Yea5WNJEjoOeXL4wZJyl4Xl8bdYnCl6WYilJkeYfIm/TAthKpcgfJMjKRovJkARBEF0LOvVGSiZJEDgEaj7N5zVqBfezndmGEMKzgRYcQf4g6Eo26MPkDxzbQVfsUiLxab4k20HvXP3Ch5aD3+mQLH/g14IUCce2pSRFYpjf2eT79GS/C1MJnnOO85ba8/ELH3c0/5K4NPFrvoO2xraUjVQW7568hB/N/XRB1Y8SSGgv2m41bzIVv+VKHii3U240/YwEFb/l/sZw+QNL6W4/o9O7kLDt1XJlIQNgeTY0z5ZjI9V24rhKsa3ciqwh+QOvOTbJtqlspLKxsvQ7HYb8lp7txGWdUOHK3m/3t9zPj3YjyRY5TxANwU0zP8KxpfO5o/lXvNS3GUO5rZGInDfucoI3EBLQqAtO4T+mn87V0/OTK8sGtYFKFhfXs9fsRXO79+aHaghpAY4Jz2VtZBs+TceSNstKMgsJLS05hJlF09CFD0vaHBmeQ0gLsCDkSBBYOB13Vf5JTPVPRgFHlMxKsq2zsDh9p6EjfzCPnbF2/JoPUw7JHxxVMoeaomlOhknaHBU+hKDw0RCq8WxLpZjqn0x1oAINwZElc+gw+7yuxQXFNRRrQZaFD+H1iMCn6djKYukofqfDQlf+wEJ6tpPlD5JjvnAUvqzjShvYHd/n+X1MeN6Yl1eQw0v6SDCVzcv9m3m6Zz1vR5votQcxpbteLjgUmtAo1oLUBas4sfRQTi07nOl56GjkigE75vDtAgHN53WrxaVJnx0lQaKQTfqwy+r3qDcn+UIEhZMV7LEGPEK5Yi1IidshGLFjXrWCX9NHLf23laTbinh/L/eFvWVnp9Xv0XtO0kME3Yxkjz2AKZ0nSrEW8Gw7fjs3P7/QKXOJ2PLxOx167UEMaaWxvX/M8/F7LBjTBBkOiSq4ClEyEi2eE5jAgUJBJ8gEJvCvhonb8QQmkAETE2QCE8iAiQkygQlkwMQEmcAEMmBigkxgAhkwMUEmMIEMmJggE5hABkxMkAlMIAP+PxJ5hKlSPHpRAAAAAElFTkSuQmCC" alt="LINE QR Code" style="width: 120px; height: 120px; border-radius: 8px; display: block;" onerror="this.style.display=\'none\'; this.nextElementSibling.style.display=\'flex\';">' +
        '<div style="width: 120px; height: 120px; background: #00C300; color: white; display: none; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; border-radius: 8px;">LINE QR</div>' +
        '<p style="color: #333; font-size: 0.8rem; margin-top: 8px; font-weight: 600;">掃描加LINE</p>' +
        '</div>' +
        '<div style="flex: 1; min-width: 280px;">' +
        '<div style="background: rgba(255,255,255,0.15); border-radius: 12px; padding: 20px; backdrop-filter: blur(10px);">' +
        '<h4 style="color: white; margin-bottom: 15px; font-size: 1.1rem;">📞 聯絡方式</h4>' +
        '<div style="margin-bottom: 12px;">' +
        '<span style="color: rgba(255,255,255,0.8); font-size: 0.9rem;">LINE ID：</span>' +
        '<span style="color: white; font-weight: 700; font-size: 1rem;">@tnb0485u</span>' +
        '<span style="color: rgba(255,255,255,0.7); font-size: 0.8rem;">（第6個字是數字0）</span>' +
        '</div>' +
        '<a href="https://lin.ee/L0c0DAz" target="_blank" style="display: inline-block; background: #00C300; color: white; padding: 8px 16px; border-radius: 20px; text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: all 0.3s ease;">💬 點我直接加LINE</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div style="text-align: center; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.2);">' +
        '<p style="color: rgba(255,255,255,0.9); font-size: 1rem; font-weight: 600;">🚢 期待與你在職海中一起乘風破浪！</p>' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="buttons">' +
        '<button class="btn btn-secondary" onclick="location.reload()">重新規劃</button>' +
        '<button class="btn btn-primary" onclick="downloadPlanAsPDF()">下載完整規劃 (PNG圖片)</button>' +
        '</div>';

    container.appendChild(completionPage);
    var progressFill = document.getElementById('progressFill');
    if (progressFill) {
        progressFill.style.width = '100%';
    }
}

// 儲存三個月立即行動計劃
function saveImmediateAction() {
    var immediateActionInput = document.getElementById('immediateAction3months');
    var saveButton = document.getElementById('saveImmediateAction');
    var editButton = document.getElementById('editImmediateAction');
    var saveStatus = document.getElementById('saveStatus');
    if (!immediateActionInput || !immediateActionInput.value.trim()) {
        showToast('📝 請先填寫三個月內立即可以完成的行動！', 'error');
        return;
    }
    planData.immediateAction3months = immediateActionInput.value.trim();
    planData.immediateActionSaved = true;
    saveButton.style.display = 'none';
    editButton.style.display = 'inline-block';
    saveStatus.textContent = '✅ 已儲存';
    saveStatus.style.color = '#4caf50';
    saveStatus.style.fontWeight = '600';
    immediateActionInput.disabled = true;
    immediateActionInput.style.background = '#f8f9fa';
    immediateActionInput.style.borderColor = '#e9ecef';
    showToast('💾 三個月行動計劃已儲存！', 'success');
}

// 修改三個月立即行動計劃
function editImmediateAction() {
    var immediateActionInput = document.getElementById('immediateAction3months');
    var saveButton = document.getElementById('saveImmediateAction');
    var editButton = document.getElementById('editImmediateAction');
    var saveStatus = document.getElementById('saveStatus');
    saveButton.style.display = 'inline-block';
    saveButton.textContent = '💾 儲存修改';
    saveButton.style.background = '#2196f3';
    editButton.style.display = 'none';
    saveStatus.textContent = '✏️ 編輯中';
    saveStatus.style.color = '#ff9800';
    saveStatus.style.fontWeight = '600';
    immediateActionInput.disabled = false;
    immediateActionInput.style.background = 'white';
    immediateActionInput.style.borderColor = '#2196f3';
    immediateActionInput.focus();
    showToast('✏️ 現在可以修改你的三個月行動計劃', 'info');
}

// 下載功能
function downloadPlanAsPDF() {
    if (!planData.immediateActionSaved) {
        showToast('⚠️ 請先儲存你的三個月立即行動計劃才能下載完整規劃！', 'error');
        return;
    }

    var progressIndicator = document.getElementById('downloadProgress');
    if (progressIndicator) {
        progressIndicator.style.display = 'block';
    }

    showToast('📸 正在生成規劃圖片...', 'info');
    setTimeout(function () {
        generateImageDownload();
    }, 500);
}

// 生成圖片下載
function generateImageDownload() {
    var planContent = null;

    try {
        planContent = document.createElement('div');
        planContent.id = 'planContentForImage';
        planContent.style.cssText = 'position: absolute; left: -9999px; width: 1200px; padding: 40px; background: white; font-family: "Microsoft JhengHei", sans-serif; line-height: 1.6;';

        planContent.innerHTML = generatePlanHTML();
        document.body.appendChild(planContent);

        // 預先載入圖片以確保生成時已就緒
        var img = new Image();
        img.src = 'data:image/png;base64,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';

        setTimeout(function () {
            if (typeof html2canvas !== 'undefined') {
                html2canvas(planContent, {
                    scale: 1.5,
                    useCORS: true,
                    // allowTaint: true, // Removed to prevent security error with toBlob
                    backgroundColor: '#ffffff',
                    logging: false,
                    width: 1280,
                    height: planContent.scrollHeight + 100
                }).then(function (canvas) {
                    try {
                        canvas.toBlob(function (blob) {
                            if (blob) {
                                downloadBlob(blob);
                                cleanupAndHideProgress(planContent);
                                showToast('📸 規劃圖片已成功下載！', 'success');
                            } else {
                                throw new Error('無法生成圖片 Blob');
                            }
                        }, 'image/png', 0.95);
                    } catch (error) {
                        console.error('Canvas to blob error:', error);
                        cleanupAndFallback(planContent);
                    }
                }).catch(function (error) {
                    console.error('html2canvas error:', error);
                    cleanupAndFallback(planContent);
                });
            } else {
                console.warn('html2canvas not available');
                cleanupAndFallback(planContent);
            }
        }, 1000);

    } catch (error) {
        console.error('Error in generateImageDownload:', error);
        cleanupAndFallback(planContent);
    }
}

// 下載 Blob 的輔助函數
function downloadBlob(blob) {
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    var now = new Date();
    var dateStr = now.getFullYear() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0');

    link.download = '我的人生規劃_' + dateStr + '.png';
    link.href = url;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 100);
}

// 清理並隱藏進度條
function cleanupAndHideProgress(planContent) {
    if (planContent && document.body.contains(planContent)) {
        document.body.removeChild(planContent);
    }
    var progressIndicator = document.getElementById('downloadProgress');
    if (progressIndicator) {
        progressIndicator.style.display = 'none';
    }
}

// 清理並回退到文字版
function cleanupAndFallback(planContent) {
    cleanupAndHideProgress(planContent);
    showToast('⚠️ 圖片生成失敗，改用文字版下載...', 'warning');
    setTimeout(function () {
        fallbackTextDownload();
    }, 500);
}

// 生成規劃的 HTML 內容
function generatePlanHTML() {
    var priorities10 = getPriorities('priorities10');
    var timeAllocation10 = getTimeAllocation('10');
    var total10 = calculateTotalTime('10');

    var priorities5 = getPriorities('priorities5');
    var timeAllocation5 = getTimeAllocation('5');
    var total5 = calculateTotalTime('5');

    var priorities1 = getPriorities('priorities1');
    var timeAllocation1 = getTimeAllocation('1');
    var total1 = calculateTotalTime('1');

    var html = '<div style="text-align: center; margin-bottom: 40px;">' +
        '<h1 style="color: #2e7d32; font-size: 3rem; margin-bottom: 10px;">我的人生規劃</h1>' +
        '<p style="color: #666; font-size: 1.2rem;">規劃日期：' + new Date().toLocaleDateString('zh-TW') + '</p>' +
        '</div>';

    // 五十歲願景
    html += '<div style="background: linear-gradient(135deg, #e8f5e8, #c8e6c9); border: 3px solid #4caf50; border-radius: 15px; padding: 25px; margin-bottom: 30px;">' +
        '<h2 style="color: #2e7d32; margin-bottom: 15px;">🎯 五十歲願景</h2>' +
        '<p style="color: #1b5e20; line-height: 1.8; font-size: 1.1rem;">' + (planData.vision50 || '未填寫') + '</p>' +
        '</div>';

    // 十年規劃
    html += '<div style="background: linear-gradient(135deg, #fff8e1, #ffecb3); border: 3px solid #ffc107; border-radius: 15px; padding: 25px; margin-bottom: 30px;">' +
        '<h2 style="color: #e65100; margin-bottom: 20px;">📊 十年規劃</h2>' +
        '<p style="color: #ef6c00; font-size: 1.1rem; margin-bottom: 20px;"><strong>總投入時間：' + total10 + ' / 168 小時 (' + ((total10 / 168) * 100).toFixed(1) + '%)</strong></p>';

    for (var i = 0; i < priorities10.length; i++) {
        var hours10 = timeAllocation10[priorities10[i]] || 0;
        var percentage10 = ((hours10 / 168) * 100).toFixed(1);
        var sliderWidth10 = Math.min((hours10 / 60) * 100, 100);

        html += '<div style="margin: 15px 0; padding: 15px; background: white; border-radius: 10px;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
            '<span style="font-weight: bold; color: #e65100; font-size: 1rem;">' + (i + 1) + '. ' + priorities10[i] + '</span>' +
            '<span style="color: #ef6c00; font-weight: bold;">' + hours10 + ' 小時 (' + percentage10 + '%)</span>' +
            '</div>' +
            '<div style="position: relative; width: 100%; height: 25px; background: #e9ecef; border-radius: 12px; overflow: visible;">' +
            '<div style="position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, #ffc107, #ff9800); border-radius: 12px; width: ' + sliderWidth10 + '%;"></div>' +
            '<div style="position: absolute; top: 50%; left: ' + sliderWidth10 + '%; width: 20px; height: 20px; background: white; border: 3px solid #ff9800; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>' +
            '</div>' +
            '</div>';
    }

    if (planData.actionPlan10) {
        html += '<div style="background: rgba(239, 108, 0, 0.1); padding: 15px; border-radius: 8px; margin-top: 20px;">' +
            '<strong style="color: #ef6c00;">📋 十年行動計劃：</strong><br>' +
            '<span style="color: #ef6c00;">' + planData.actionPlan10 + '</span>' +
            '</div>';
    }
    html += '</div>';

    // 五年規劃
    html += '<div style="background: linear-gradient(135deg, #f3e5f5, #e1bee7); border: 3px solid #9c27b0; border-radius: 15px; padding: 25px; margin-bottom: 30px;">' +
        '<h2 style="color: #4a148c; margin-bottom: 20px;">📋 五年規劃</h2>' +
        '<p style="color: #6a1b9a; font-size: 1.1rem; margin-bottom: 20px;"><strong>總投入時間：' + total5 + ' / 168 小時 (' + ((total5 / 168) * 100).toFixed(1) + '%)</strong></p>';

    for (var i = 0; i < priorities5.length; i++) {
        var hours5 = timeAllocation5[priorities5[i]] || 0;
        var percentage5 = ((hours5 / 168) * 100).toFixed(1);
        var sliderWidth5 = Math.min((hours5 / 60) * 100, 100);

        html += '<div style="margin: 15px 0; padding: 15px; background: white; border-radius: 10px;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
            '<span style="font-weight: bold; color: #4a148c; font-size: 1rem;">' + (i + 1) + '. ' + priorities5[i] + '</span>' +
            '<span style="color: #6a1b9a; font-weight: bold;">' + hours5 + ' 小時 (' + percentage5 + '%)</span>' +
            '</div>' +
            '<div style="position: relative; width: 100%; height: 25px; background: #e9ecef; border-radius: 12px; overflow: visible;">' +
            '<div style="position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, #9c27b0, #6a1b9a); border-radius: 12px; width: ' + sliderWidth5 + '%;"></div>' +
            '<div style="position: absolute; top: 50%; left: ' + sliderWidth5 + '%; width: 20px; height: 20px; background: white; border: 3px solid #9c27b0; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>' +
            '</div>' +
            '</div>';
    }

    if (planData.actionPlan5) {
        html += '<div style="background: rgba(106, 27, 154, 0.1); padding: 15px; border-radius: 8px; margin-top: 20px;">' +
            '<strong style="color: #6a1b9a;">📋 五年行動計劃：</strong><br>' +
            '<span style="color: #6a1b9a;">' + planData.actionPlan5 + '</span>' +
            '</div>';
    }
    html += '</div>';

    // 一年規劃
    html += '<div style="background: white; border: 3px solid #607d8b; border-radius: 15px; padding: 25px; margin-bottom: 30px;">' +
        '<h2 style="color: #455a64; margin-bottom: 20px;">🚀 一年規劃（重點執行）</h2>' +
        '<p style="color: #607d8b; font-size: 1.1rem; margin-bottom: 20px;"><strong>總投入時間：' + total1 + ' / 168 小時 (' + ((total1 / 168) * 100).toFixed(1) + '%)</strong></p>';

    for (var i = 0; i < priorities1.length; i++) {
        var hours1 = timeAllocation1[priorities1[i]] || 0;
        var percentage1 = ((hours1 / 168) * 100).toFixed(1);
        var sliderWidth1 = Math.min((hours1 / 60) * 100, 100);

        html += '<div style="margin: 15px 0; padding: 15px; background: #f8f9fa; border-radius: 10px;">' +
            '<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">' +
            '<span style="font-weight: bold; color: #455a64; font-size: 1rem;">' + (i + 1) + '. ' + priorities1[i] + '</span>' +
            '<span style="color: #607d8b; font-weight: bold;">' + hours1 + ' 小時 (' + percentage1 + '%)</span>' +
            '</div>' +
            '<div style="position: relative; width: 100%; height: 25px; background: #e9ecef; border-radius: 12px; overflow: visible;">' +
            '<div style="position: absolute; top: 0; left: 0; height: 100%; background: linear-gradient(90deg, #607d8b, #455a64); border-radius: 12px; width: ' + sliderWidth1 + '%;"></div>' +
            '<div style="position: absolute; top: 50%; left: ' + sliderWidth1 + '%; width: 20px; height: 20px; background: white; border: 3px solid #607d8b; border-radius: 50%; transform: translate(-50%, -50%); box-shadow: 0 2px 5px rgba(0,0,0,0.2);"></div>' +
            '</div>' +
            '</div>';
    }

    if (planData.actionPlan1) {
        html += '<div style="background: rgba(96, 125, 139, 0.1); padding: 15px; border-radius: 8px; margin-top: 20px;">' +
            '<strong style="color: #607d8b;">📋 一年行動計劃：</strong><br>' +
            '<span style="color: #607d8b;">' + planData.actionPlan1 + '</span>' +
            '</div>';
    }
    html += '</div>';

    // 三個月立即行動
    if (planData.immediateAction3months) {
        html += '<div style="background: linear-gradient(135deg, #e3f2fd, #bbdefb); border: 3px solid #2196f3; border-radius: 15px; padding: 25px; margin-bottom: 30px;">' +
            '<h2 style="color: #1565c0; margin-bottom: 15px;">💡 三個月立即行動</h2>' +
            '<p style="color: #1976d2; line-height: 1.8;">' + planData.immediateAction3months + '</p>' +
            '</div>';
    }

    // 職涯諮詢資訊
    html += '<div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; padding: 30px; margin-top: 40px; color: white;">' +
        '<h2 style="color: white; text-align: center; margin-bottom: 20px;">🌟 對你的人生與生涯有迷惘嗎？</h2>' +
        '<div style="text-align: center;">' +
        '<h3 style="color: white; margin-bottom: 15px;">您好，我是職海中的PM旅人</h3>' +
        '<p style="color: white; line-height: 1.8; margin-bottom: 20px;">在職場的海洋中載浮載沉，我願意作為你的旅伴<br>為你點亮一盞明燈，陪你照亮職涯的每一哩路</p>' +
        '<p style="color: white; font-size: 0.9rem; margin-bottom: 10px;">📚 我的職涯文章分享</p>' +
        '<p style="color: white; text-decoration: underline; margin-bottom: 30px;">職海中的PM旅人 - 過往文章</p>' +
        '</div>' +
        '<div style="background: rgba(255,255,255,0.2); padding: 25px; border-radius: 15px; text-align: center;">' +
        '<h4 style="color: white; margin-bottom: 20px; font-size: 1.3rem;">📞 聯絡方式</h4>' +
        '<div style="background: #00C300; color: white; padding: 20px; border-radius: 15px; margin: 20px auto; max-width: 400px;">' +
        '<div style="text-align: center; margin-bottom: 15px;">' +
        '<img src="data:image/png;base64,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" alt="LINE QR Code" style="width: 120px; height: 120px; border-radius: 8px; display: block; margin: 0 auto;" onerror="this.style.display=\'none\';">' +
        '</div>' +
        '<div style="font-size: 2rem; margin-bottom: 10px;">📱</div>' +
        '<p style="margin: 10px 0; font-size: 1.2rem; font-weight: bold;">LINE ID：@tnb0485u</p>' +
        '<p style="margin: 5px 0; font-size: 0.9rem;">（第6個字是數字0）</p>' +
        '<div style="background: rgba(255,255,255,0.2); padding: 10px; border-radius: 10px; margin-top: 15px;">' +
        '<p style="margin: 0; font-size: 0.9rem;">掃描QR Code或直接加LINE</p>' +
        '</div>' +
        '</div>' +
        '<p style="color: white; font-size: 1rem; margin-top: 20px;">💬 點擊連結直接加LINE：https://lin.ee/L0c0DAz</p>' +
        '</div>' +
        '<p style="color: white; text-align: center; margin-top: 30px; font-size: 1.1rem; font-weight: bold;">🚢 期待與你在職海中一起乘風破浪！</p>' +
        '</div>';

    return html;
}

// 純文字下載
function fallbackTextDownload() {
    try {
        var textContent = generateTextPlan();
        var blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        var now = new Date();
        var dateStr = now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');

        link.download = '我的人生規劃_' + dateStr + '.txt';
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        var progressIndicator = document.getElementById('downloadProgress');
        if (progressIndicator) {
            progressIndicator.style.display = 'none';
        }

        showToast('📄 已下載文字版規劃！', 'success');
    } catch (error) {
        console.error('Text download error:', error);
        var progressIndicator = document.getElementById('downloadProgress');
        if (progressIndicator) {
            progressIndicator.style.display = 'none';
        }
        showToast('⚠️ 下載失敗，請手動複製畫面內容', 'error');
    }
}

// 生成純文字版規劃
function generateTextPlan() {
    var content = '====================================\n';
    content += '           我的人生規劃\n';
    content += '====================================\n\n';

    content += '🎯 五十歲願景\n';
    content += '─────────────────────────\n';
    content += planData.vision50 + '\n\n';

    var priorities10 = getPriorities('priorities10');
    var timeAllocation10 = getTimeAllocation('10');
    var total10 = calculateTotalTime('10');

    content += '📊 十年規劃\n';
    content += '─────────────────────────\n';
    content += '總投入時間：' + total10 + ' / 168 小時 (' + ((total10 / 168) * 100).toFixed(1) + '%)\n\n';
    content += '優先順序與時間分配：\n';
    for (var i = 0; i < priorities10.length; i++) {
        var hours = timeAllocation10[priorities10[i]] || 0;
        var percentage = ((hours / 168) * 100).toFixed(1);
        content += (i + 1) + '. ' + priorities10[i] + '：' + hours + ' 小時 (' + percentage + '%)\n';
    }
    if (planData.actionPlan10) {
        content += '\n十年行動計劃：\n' + planData.actionPlan10 + '\n';
    }
    content += '\n';

    var priorities5 = getPriorities('priorities5');
    var timeAllocation5 = getTimeAllocation('5');
    var total5 = calculateTotalTime('5');

    content += '📋 五年規劃\n';
    content += '─────────────────────────\n';
    content += '總投入時間：' + total5 + ' / 168 小時 (' + ((total5 / 168) * 100).toFixed(1) + '%)\n\n';
    content += '優先順序與時間分配：\n';
    for (var i = 0; i < priorities5.length; i++) {
        var hours = timeAllocation5[priorities5[i]] || 0;
        var percentage = ((hours / 168) * 100).toFixed(1);
        content += (i + 1) + '. ' + priorities5[i] + '：' + hours + ' 小時 (' + percentage + '%)\n';
    }
    if (planData.actionPlan5) {
        content += '\n五年行動計劃：\n' + planData.actionPlan5 + '\n';
    }
    content += '\n';

    var priorities1 = getPriorities('priorities1');
    var timeAllocation1 = getTimeAllocation('1');
    var total1 = calculateTotalTime('1');

    content += '🚀 一年規劃（重點執行）\n';
    content += '─────────────────────────\n';
    content += '總投入時間：' + total1 + ' / 168 小時 (' + ((total1 / 168) * 100).toFixed(1) + '%)\n\n';
    content += '優先順序與時間分配：\n';
    for (var i = 0; i < priorities1.length; i++) {
        var hours = timeAllocation1[priorities1[i]] || 0;
        var percentage = ((hours / 168) * 100).toFixed(1);
        content += (i + 1) + '. ' + priorities1[i] + '：' + hours + ' 小時 (' + percentage + '%)\n';
    }
    if (planData.actionPlan1) {
        content += '\n一年行動計劃：\n' + planData.actionPlan1 + '\n';
    }
    content += '\n';

    if (planData.immediateAction3months) {
        content += '💡 三個月立即行動\n';
        content += '─────────────────────────\n';
        content += planData.immediateAction3months + '\n\n';
    }

    content += '💡 下一步建議\n';
    content += '─────────────────────────\n';
    content += '• 將這個規劃保存下來，定期回顧和調整\n';
    content += '• 專注執行一年計畫，這是最關鍵的行動指南\n';
    content += '• 每季檢視進度，確保朝著五十歲願景前進\n';
    content += '• 記錄實際時間分配，與規劃進行對比調整\n\n';

    content += '🌟 對你的人生與生涯有迷惘嗎？\n';
    content += '====================================\n';
    content += '**您好，我是職海中的PM旅人**\n\n';
    content += '在職場的海洋中載浮載沉，我願意作為你的旅伴\n';
    content += '為你點亮一盞明燈，陪你照亮職涯的每一哩路\n\n';
    content += '📚 我的職涯文章分享\n';
    content += '職海中的PM旅人 - 過往文章\n';
    content += 'https://vocus.cc/tags/職海中的PM旅人\n\n';
    content += '📞 聯絡方式\n';
    content += 'LINE ID：**@tnb0485u**（第6個字是數字0）\n';
    content += '點我直接加LINE：https://lin.ee/L0c0DAz\n\n';
    content += '**🚢 期待與你在職海中一起乘風破浪！**\n\n';

    content += '====================================\n';
    content += '    規劃日期：' + new Date().toLocaleDateString('zh-TW') + '\n';
    content += '====================================\n';

    return content;
}

// 顯示提示訊息
function showToast(message, type) {
    type = type || 'info';
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function () {
        toast.classList.add('show');
    }, 100);

    setTimeout(function () {
        toast.classList.remove('show');
        setTimeout(function () {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// 編輯優先級項目
function editPriority(btn) {
    var priorityItem = btn.closest('.priority-item');
    var textSpan = priorityItem.querySelector('.priority-text');
    var currentText = textSpan.textContent.trim();

    if (priorityItem.querySelector('input')) return;

    // 保存當前的時間分配值
    var activeStep = document.querySelector('.step-card.active');
    var savedValues = {};
    if (activeStep) {
        var stepId = activeStep.id;
        var step = stepId === 'step1' ? '10' : (stepId === 'step2' ? '5' : (stepId === 'step3' ? '1' : ''));
        if (step) {
            var sliders = document.querySelectorAll('#timeAllocation' + step + ' .slider-container');
            for (var i = 0; i < sliders.length; i++) {
                var priority = sliders[i].dataset.priority;
                if (priority) {
                    savedValues[priority] = sliders[i].getValue ? sliders[i].getValue() : 1;
                }
            }
        }
    }

    var input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.style.cssText = 'flex: 1; padding: 8px; border: 2px solid #667eea; border-radius: 8px; font-size: 1.1rem; font-weight: 600; background: white; font-family: inherit; outline: none;';

    var confirmBtn = document.createElement('button');
    confirmBtn.innerHTML = '✅';
    confirmBtn.style.cssText = 'margin-left: 8px; padding: 8px 12px; border: none; background: #48bb78; color: white; border-radius: 6px; cursor: pointer; font-family: inherit;';

    var cancelBtn = document.createElement('button');
    cancelBtn.innerHTML = '❌';
    cancelBtn.style.cssText = 'margin-left: 5px; padding: 8px 12px; border: none; background: #e74c3c; color: white; border-radius: 6px; cursor: pointer; font-family: inherit;';

    textSpan.style.display = 'none';
    btn.style.display = 'none';

    textSpan.parentNode.insertBefore(input, textSpan);
    textSpan.parentNode.insertBefore(confirmBtn, textSpan);
    textSpan.parentNode.insertBefore(cancelBtn, textSpan);

    input.focus();
    input.select();

    function confirmEdit() {
        var newText = input.value.trim();
        if (newText === '' || newText.length > 15) {
            showToast('項目名稱不能為空且不能超過15個字！', 'error');
            return;
        }

        var container = priorityItem.parentElement;
        var otherItems = container.querySelectorAll('.priority-text');
        for (var i = 0; i < otherItems.length; i++) {
            if (otherItems[i] !== textSpan && otherItems[i].textContent.trim() === newText) {
                showToast('這個名稱已經存在，請使用不同的名稱！', 'error');
                return;
            }
        }

        // 更新時間分配的key
        if (savedValues[currentText] !== undefined) {
            savedValues[newText] = savedValues[currentText];
            delete savedValues[currentText];
        }

        textSpan.textContent = newText;
        restoreDisplay();
        showToast('編輯成功！', 'success');

        // 重建時間分配並恢復值
        if (activeStep) {
            var stepId = activeStep.id;
            if (stepId === 'step1') {
                createTimeAllocationWithValues('10', savedValues);
            } else if (stepId === 'step2') {
                createTimeAllocationWithValues('5', savedValues);
            } else if (stepId === 'step3') {
                createTimeAllocationWithValues('1', savedValues);
            }
        }
    }

    function cancelEdit() {
        restoreDisplay();
    }

    function restoreDisplay() {
        textSpan.style.display = '';
        btn.style.display = '';
        if (input.parentNode) input.remove();
        if (confirmBtn.parentNode) confirmBtn.remove();
        if (cancelBtn.parentNode) cancelBtn.remove();
    }

    confirmBtn.addEventListener('click', confirmEdit);
    cancelBtn.addEventListener('click', cancelEdit);

    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            confirmEdit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    });
}

// 刪除優先級項目
function removePriority(btn) {
    var priorityItem = btn.closest('.priority-item');
    var container = priorityItem.parentElement;
    var currentCount = container.querySelectorAll('.priority-item').length;

    if (currentCount <= 3) {
        showToast('至少需要保留3個人生領域！', 'error');
        return;
    }

    var itemName = priorityItem.querySelector('.priority-text').textContent.trim();

    // 保存當前的時間分配值
    var activeStep = document.querySelector('.step-card.active');
    var savedValues = {};
    if (activeStep) {
        var stepId = activeStep.id;
        var step = stepId === 'step1' ? '10' : (stepId === 'step2' ? '5' : (stepId === 'step3' ? '1' : ''));
        if (step) {
            var sliders = document.querySelectorAll('#timeAllocation' + step + ' .slider-container');
            for (var i = 0; i < sliders.length; i++) {
                var priority = sliders[i].dataset.priority;
                if (priority && priority !== itemName) {  // 不保存被刪除項目的值
                    savedValues[priority] = sliders[i].getValue ? sliders[i].getValue() : 1;
                }
            }
        }
    }

    container.removeChild(priorityItem);
    updatePriorityRanks();

    // 重建時間分配並恢復值
    if (activeStep) {
        var stepId = activeStep.id;
        if (stepId === 'step1') {
            createTimeAllocationWithValues('10', savedValues);
        } else if (stepId === 'step2') {
            createTimeAllocationWithValues('5', savedValues);
        } else if (stepId === 'step3') {
            createTimeAllocationWithValues('1', savedValues);
        }
    }

    showToast('已刪除「' + itemName + '」', 'success');
}

// 新增優先級項目
function addNewPriority() {
    var activeStep = document.querySelector('.step-card.active');
    if (!activeStep) return;

    var container = activeStep.querySelector('.priorities-container');
    if (!container) return;

    var currentItems = container.querySelectorAll('.priority-item');

    if (currentItems.length >= 10) {
        showToast('最多只能設定10個人生領域！', 'error');
        return;
    }

    var newItem = document.createElement('div');
    newItem.className = 'priority-item';
    newItem.innerHTML = '<input type="text" placeholder="輸入新的人生領域名稱..." style="flex: 1; padding: 12px; border: 2px solid #667eea; border-radius: 8px; font-size: 1.1rem; font-weight: 600; font-family: inherit; outline: none;" class="new-item-input">' +
        '<div class="priority-actions">' +
        '<button onclick="confirmNewItem(this)" style="margin-left: 8px; padding: 8px 12px; border: none; background: #48bb78; color: white; border-radius: 6px; cursor: pointer; font-family: inherit;">✅</button>' +
        '<button onclick="cancelNewItem(this)" style="margin-left: 5px; padding: 8px 12px; border: none; background: #e74c3c; color: white; border-radius: 6px; cursor: pointer; font-family: inherit;">❌</button>' +
        '<div class="priority-rank">' + (currentItems.length + 1) + '</div>' +
        '</div>';

    var addButton = container.querySelector('.add-priority-btn');
    container.insertBefore(newItem, addButton);

    var input = newItem.querySelector('.new-item-input');
    input.focus();
}

// 確認新增項目
function confirmNewItem(btn) {
    var newItem = btn.closest('.priority-item');
    var input = newItem.querySelector('.new-item-input');
    var newText = input.value.trim();
    var container = newItem.parentElement;

    if (newText === '') {
        showToast('項目名稱不能為空！', 'error');
        input.focus();
        return;
    }

    if (newText.length > 15) {
        showToast('項目名稱請控制在15個字以內！', 'error');
        input.focus();
        return;
    }

    var existingItems = container.querySelectorAll('.priority-text');
    for (var i = 0; i < existingItems.length; i++) {
        if (existingItems[i].textContent.trim() === newText) {
            showToast('這個名稱已經存在，請使用不同的名稱！', 'error');
            input.focus();
            return;
        }
    }

    // 保存當前的時間分配值
    var activeStep = document.querySelector('.step-card.active');
    var savedValues = {};
    if (activeStep) {
        var stepId = activeStep.id;
        var step = stepId === 'step1' ? '10' : (stepId === 'step2' ? '5' : (stepId === 'step3' ? '1' : ''));
        if (step) {
            var sliders = document.querySelectorAll('#timeAllocation' + step + ' .slider-container');
            for (var i = 0; i < sliders.length; i++) {
                var priority = sliders[i].dataset.priority;
                if (priority) {
                    savedValues[priority] = sliders[i].getValue ? sliders[i].getValue() : 1;
                }
            }
        }
    }

    var rank = newItem.querySelector('.priority-rank').textContent;
    newItem.innerHTML = '<span class="priority-text">' + newText + '</span>' +
        '<div class="priority-actions">' +
        '<button class="edit-btn" onclick="editPriority(this)">✏️ 編輯</button>' +
        '<button class="cancel-btn" onclick="removePriority(this)">🗑️ 刪除</button>' +
        '<div class="priority-rank">' + rank + '</div>' +
        '</div>';
    newItem.draggable = true;

    initializeDragAndDrop();

    // 給新項目設定默認值1小時
    savedValues[newText] = 1;

    // 重建時間分配並恢復值
    if (activeStep) {
        var stepId = activeStep.id;
        if (stepId === 'step1') {
            createTimeAllocationWithValues('10', savedValues);
        } else if (stepId === 'step2') {
            createTimeAllocationWithValues('5', savedValues);
        } else if (stepId === 'step3') {
            createTimeAllocationWithValues('1', savedValues);
        }
    }

    showToast('已新增「' + newText + '」', 'success');
}

// 取消新增項目
function cancelNewItem(btn) {
    var newItem = btn.closest('.priority-item');
    var container = newItem.parentElement;
    container.removeChild(newItem);
    updatePriorityRanks();
}

// 更新優先級排名
function updatePriorityRanks(containerId) {
    if (!containerId) {
        var activeStep = document.querySelector('.step-card.active');
        if (activeStep) {
            var prioritiesContainer = activeStep.querySelector('.priorities-container');
            if (prioritiesContainer) {
                containerId = prioritiesContainer.id;
            }
        }
    }

    var selector = containerId ? '#' + containerId + ' .priority-item' : '.priority-item';
    var items = document.querySelectorAll(selector);

    // 保存當前的時間分配值
    var activeStep = document.querySelector('.step-card.active');
    var savedValues = {};
    if (activeStep) {
        var stepId = activeStep.id;
        var step = stepId === 'step1' ? '10' : (stepId === 'step2' ? '5' : (stepId === 'step3' ? '1' : ''));
        if (step) {
            var sliders = document.querySelectorAll('#timeAllocation' + step + ' .slider-container');
            for (var i = 0; i < sliders.length; i++) {
                var priority = sliders[i].dataset.priority;
                if (priority) {
                    savedValues[priority] = sliders[i].getValue ? sliders[i].getValue() : 1;
                }
            }
        }
    }

    for (var i = 0; i < items.length; i++) {
        var rank = items[i].querySelector('.priority-rank');
        if (rank) {
            rank.textContent = i + 1;
        }
    }

    // 重建時間分配並恢復值
    if (activeStep) {
        var stepId = activeStep.id;
        if (stepId === 'step1') {
            setTimeout(function () { createTimeAllocationWithValues('10', savedValues); }, 100);
        } else if (stepId === 'step2') {
            setTimeout(function () { createTimeAllocationWithValues('5', savedValues); }, 100);
        } else if (stepId === 'step3') {
            setTimeout(function () { createTimeAllocationWithValues('1', savedValues); }, 100);
        }
    }
}

// 創建時間分配（帶有預設值）
function createTimeAllocationWithValues(step, savedValues) {
    step = step || '10';
    savedValues = savedValues || window.savedTimeAllocationForNextStep || {};
    var container = document.getElementById('timeAllocation' + step);
    var priorities = getPriorities('priorities' + step);
    if (!container) return;
    container.innerHTML = '';
    for (var i = 0; i < priorities.length; i++) {
        var timeItem = document.createElement('div');
        timeItem.className = 'time-item';
        var savedValue = savedValues[priorities[i]] || 1;
        timeItem.innerHTML = '<label>' + priorities[i] + '</label>' +
            '<div class="slider-container" data-priority="' + priorities[i] + '">' +
            '<div class="slider-fill"></div>' +
            '<div class="slider-thumb"></div>' +
            '</div>' +
            '<div class="time-display">' + savedValue + ' 小時 (' + (savedValue / 168 * 100).toFixed(1) + '%)</div>';
        container.appendChild(timeItem);
        initCustomSlider(timeItem.querySelector('.slider-container'), step, savedValue);
    }
    updateTotalTime(step);
}

// 創建時間分配
function createTimeAllocation(step) {
    step = step || '10';
    var container = document.getElementById('timeAllocation' + step);
    var priorities = getPriorities('priorities' + step);
    if (!container) return;

    // 如果有保存的時間分配，使用它
    var savedValues = window.savedTimeAllocationForNextStep || {};

    container.innerHTML = '';
    for (var i = 0; i < priorities.length; i++) {
        var timeItem = document.createElement('div');
        timeItem.className = 'time-item';
        var initialValue = savedValues[priorities[i]] || 1;
        timeItem.innerHTML = '<label>' + priorities[i] + '</label>' +
            '<div class="slider-container" data-priority="' + priorities[i] + '">' +
            '<div class="slider-fill"></div>' +
            '<div class="slider-thumb"></div>' +
            '</div>' +
            '<div class="time-display">' + initialValue + ' 小時 (' + (initialValue / 168 * 100).toFixed(1) + '%)</div>';
        container.appendChild(timeItem);
        initCustomSlider(timeItem.querySelector('.slider-container'), step, initialValue);
    }
    updateTotalTime(step);

    // 清除保存的值，避免影響後續操作
    if (window.savedTimeAllocationForNextStep) {
        delete window.savedTimeAllocationForNextStep;
    }
}

// 初始化自定義滑桿
function initCustomSlider(sliderContainer, step, initialValue) {
    step = step || '10';
    initialValue = initialValue || 1;
    var thumb = sliderContainer.querySelector('.slider-thumb');
    var fill = sliderContainer.querySelector('.slider-fill');
    var display = sliderContainer.parentElement.querySelector('.time-display');
    var isDragging = false;
    var currentValue = initialValue;
    var maxValue = 60;

    function updateSlider(value) {
        value = Math.max(1, Math.min(maxValue, value));
        currentValue = value;
        var percentage = (value / maxValue) * 100;
        thumb.style.left = percentage + '%';
        fill.style.width = percentage + '%';
        var timePercentage = (value / 168 * 100).toFixed(1);
        display.textContent = value + ' 小時 (' + timePercentage + '%)';
        updateTotalTime(step);
    }

    function getValueFromPosition(clientX) {
        var rect = sliderContainer.getBoundingClientRect();
        var percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(percentage * maxValue);
    }

    sliderContainer.addEventListener('mousedown', function (e) {
        isDragging = true;
        updateSlider(getValueFromPosition(e.clientX));
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (isDragging) {
            updateSlider(getValueFromPosition(e.clientX));
            e.preventDefault();
        }
    });

    document.addEventListener('mouseup', function () {
        isDragging = false;
    });

    sliderContainer.addEventListener('touchstart', function (e) {
        isDragging = true;
        var touch = e.touches[0];
        updateSlider(getValueFromPosition(touch.clientX));
        e.preventDefault();
    });

    document.addEventListener('touchmove', function (e) {
        if (isDragging) {
            var touch = e.touches[0];
            updateSlider(getValueFromPosition(touch.clientX));
            e.preventDefault();
        }
    });

    document.addEventListener('touchend', function () {
        isDragging = false;
    });

    sliderContainer.getValue = function () {
        return currentValue;
    };

    updateSlider(initialValue);
}

// 更新總時間
function updateTotalTime(step) {
    step = step || '10';
    var sliders = document.querySelectorAll('#timeAllocation' + step + ' .slider-container');
    var total = 0;
    for (var i = 0; i < sliders.length; i++) {
        var value = sliders[i].getValue ? sliders[i].getValue() : 0;
        total += value;
    }
    var totalElement = document.getElementById('totalTime' + step);
    if (totalElement) {
        totalElement.textContent = total;
        if (total > 168) {
            totalElement.parentElement.classList.add('over-limit');
        } else {
            totalElement.parentElement.classList.remove('over-limit');
        }
    }
    showTimeWarning(total, step);
}

// 計算總時間
function calculateTotalTime(step) {
    step = step || '10';
    var sliders = document.querySelectorAll('#timeAllocation' + step + ' .slider-container');
    var total = 0;
    for (var i = 0; i < sliders.length; i++) {
        var value = sliders[i].getValue ? sliders[i].getValue() : 0;
        total += value;
    }
    return total;
}

// 取得時間分配
function getTimeAllocation(step) {
    step = step || '10';
    var sliders = document.querySelectorAll('#timeAllocation' + step + ' .slider-container');
    var allocation = {};
    for (var i = 0; i < sliders.length; i++) {
        var priority = sliders[i].dataset.priority;
        allocation[priority] = sliders[i].getValue ? sliders[i].getValue() : 0;
    }
    return allocation;
}

// 取得優先級
function getPriorities(containerId) {
    containerId = containerId || 'priorities10';
    var items = document.querySelectorAll('#' + containerId + ' .priority-item .priority-text');
    var priorities = [];
    for (var i = 0; i < items.length; i++) {
        priorities.push(items[i].textContent.trim());
    }
    return priorities;
}

// 顯示時間警告
function showTimeWarning(total, step) {
    step = step || '10';
    var timeWarning = document.getElementById('timeWarning' + (step === '10' ? '' : step));
    var timeWarningText = document.getElementById('timeWarningText' + (step === '10' ? '' : step));

    if (total > 168) {
        if (timeWarningText) {
            timeWarningText.textContent = '你的時間分配已超過一週168小時的限制！目前總計 ' + total + ' 小時，請調整時間分配。';
        }
        if (timeWarning) {
            timeWarning.classList.add('show');
        }
        showToast('⚠️ 時間超過限制！目前 ' + total + ' 小時，請調整至168小時以內', 'error');
    } else {
        if (timeWarning) {
            timeWarning.classList.remove('show');
        }
    }
}

// 取得拖拽後的元素位置
function getDragAfterElement(container, y) {
    var draggableElements = Array.from(container.querySelectorAll('.priority-item:not([style*="opacity: 0.5"])'));
    return draggableElements.reduce(function (closest, child) {
        var box = child.getBoundingClientRect();
        var offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// 初始化拖放功能
function initializeDragAndDrop() {
    var containers = document.querySelectorAll('.priorities-container');
    for (var c = 0; c < containers.length; c++) {
        var container = containers[c];
        var items = container.querySelectorAll('.priority-item');
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.addEventListener('dragstart', function (e) {
                e.dataTransfer.setData('text/plain', '');
                this.style.opacity = '0.5';
            });
            item.addEventListener('dragend', function (e) {
                this.style.opacity = '';
                updatePriorityRanks(this.closest('.priorities-container').id);
            });
        }
        container.addEventListener('dragover', function (e) {
            e.preventDefault();
        });
        container.addEventListener('drop', function (e) {
            e.preventDefault();
            var draggedElement = document.querySelector('.priority-item[style*="opacity: 0.5"]');
            if (draggedElement) {
                var afterElement = getDragAfterElement(this, e.clientY);
                if (afterElement == null) {
                    var addBtn = this.querySelector('.add-priority-btn');
                    this.insertBefore(draggedElement, addBtn);
                } else {
                    this.insertBefore(draggedElement, afterElement);
                }
                updatePriorityRanks(this.id);
            }
        });
    }
}