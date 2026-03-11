<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTaskStore, useCharacterStore } from '@/stores'
import PixelCard from '@/components/common/PixelCard.vue'
import PixelButton from '@/components/common/PixelButton.vue'
import PixelProgressBar from '@/components/common/PixelProgressBar.vue'
import { calculateBattleDamage } from '@/services/rewardService'
import { generateId } from '@/utils/dateUtils'
import type { Boss, BossBattle, BattleResult } from '@/types'

const taskStore = useTaskStore()
const characterStore = useCharacterStore()

const battleState = ref<'idle' | 'fighting' | 'result'>('idle')
const currentBattle = ref<BossBattle | null>(null)
const attackAnimation = ref(false)

const weeklyStats = computed(() => {
  const total = taskStore.rootTasks.filter(t => t.type === 'daily' || t.type === 'weekly').length
  const completed = taskStore.getWeeklyCompletedCount()
  return { total, completed }
})

const BOSSES: Boss[] = [
  { id: '1', name: '史莱姆王', maxHp: 100, currentHp: 100, spriteUrl: '' },
  { id: '2', name: '暗影巨龙', maxHp: 200, currentHp: 200, spriteUrl: '' },
  { id: '3', name: '混沌领主', maxHp: 300, currentHp: 300, spriteUrl: '' },
]

function startBattle() {
  const bossIndex = Math.min(characterStore.level - 1, BOSSES.length - 1)
  const bossTemplate = BOSSES[bossIndex]
  
  const damage = calculateBattleDamage(weeklyStats.value.completed, weeklyStats.value.total)
  
  currentBattle.value = {
    id: generateId(),
    boss: { ...bossTemplate },
    playerDamage: damage,
    status: 'active',
    startTime: new Date().toISOString(),
    endTime: null,
    result: null
  }
  
  battleState.value = 'fighting'
  
  setTimeout(() => {
    attackAnimation.value = true
    setTimeout(() => {
      performAttack()
    }, 500)
  }, 300)
}

function performAttack() {
  if (!currentBattle.value) return
  
  const battle = currentBattle.value
  const boss = battle.boss
  boss.currentHp = Math.max(0, boss.currentHp - battle.playerDamage)
  
  setTimeout(() => {
    attackAnimation.value = false
    
    const victory = boss.currentHp <= 0
    
    const result: BattleResult = {
      victory,
      totalDamageDealt: battle.playerDamage,
      tasksCompleted: weeklyStats.value.completed,
      experienceEarned: victory ? 50 : 20,
      goldEarned: victory ? 100 : 30
    }
    
    battle.result = result
    battle.status = 'completed'
    battle.endTime = new Date().toISOString()
    
    characterStore.addReward(result.experienceEarned, result.goldEarned)
    
    battleState.value = 'result'
  }, 300)
}

function resetBattle() {
  battleState.value = 'idle'
  currentBattle.value = null
  attackAnimation.value = false
}

const bossEmoji = computed(() => {
  if (!currentBattle.value) return '🐉'
  const hpPercent = currentBattle.value.boss.currentHp / currentBattle.value.boss.maxHp
  if (hpPercent <= 0) return '💀'
  if (hpPercent <= 0.3) return '😵'
  if (hpPercent <= 0.6) return '😤'
  return '🐉'
})
</script>

<template>
  <div class="boss-view">
    <h1 class="page-title">Boss战</h1>
    
    <div v-if="battleState === 'idle'" class="idle-state">
      <PixelCard title="本周战绩">
        <div class="weekly-stats">
          <div class="stat-item">
            <span class="stat-icon">📋</span>
            <span class="stat-label">完成任务</span>
            <span class="stat-value">{{ weeklyStats.completed }} / {{ weeklyStats.total }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon">⚔️</span>
            <span class="stat-label">预计伤害</span>
            <span class="stat-value">{{ calculateBattleDamage(weeklyStats.completed, weeklyStats.total) }}</span>
          </div>
        </div>
      </PixelCard>
      
      <PixelCard class="battle-intro">
        <div class="intro-content">
          <div class="boss-preview">🐉</div>
          <h3>挑战Boss</h3>
          <p>根据本周完成的任务数量，你的攻击将对Boss造成伤害！</p>
          <p>完成任务越多，伤害越高，奖励越丰厚！</p>
          <PixelButton type="primary" size="large" @click="startBattle">
            开始战斗
          </PixelButton>
        </div>
      </PixelCard>
    </div>
    
    <div v-else-if="battleState === 'fighting'" class="fighting-state">
      <PixelCard variant="primary">
        <div class="battle-arena">
          <div class="boss-container" :class="{ 'boss-attacked': attackAnimation }">
            <div class="boss-sprite">{{ bossEmoji }}</div>
            <div class="boss-name">{{ currentBattle?.boss.name }}</div>
            <PixelProgressBar
              v-if="currentBattle"
              :percent="(currentBattle.boss.currentHp / currentBattle.boss.maxHp) * 100"
              :label="'HP'"
              color="var(--color-danger)"
            />
          </div>
          
          <div class="player-attack" :class="{ 'attacking': attackAnimation }">
            <span class="attack-icon">⚔️</span>
          </div>
        </div>
      </PixelCard>
      
      <div class="battle-log">
        <p>造成伤害: {{ currentBattle?.playerDamage }}</p>
      </div>
    </div>
    
    <div v-else-if="battleState === 'result'" class="result-state">
      <PixelCard :variant="currentBattle?.result?.victory ? 'primary' : 'secondary'">
        <div class="battle-result">
          <div class="result-icon">
            {{ currentBattle?.result?.victory ? '🎉' : '💪' }}
          </div>
          <h2 class="result-title">
            {{ currentBattle?.result?.victory ? '胜利!' : '再接再厉!' }}
          </h2>
          
          <div class="result-stats">
            <div class="result-row">
              <span class="result-label">造成伤害</span>
              <span class="result-value">{{ currentBattle?.result?.totalDamageDealt }}</span>
            </div>
            <div class="result-row">
              <span class="result-label">完成任务</span>
              <span class="result-value">{{ currentBattle?.result?.tasksCompleted }}</span>
            </div>
          </div>
          
          <div class="reward-box">
            <h4>获得奖励</h4>
            <div class="rewards">
              <div class="reward-item">
                <span class="reward-icon">✨</span>
                <span>{{ currentBattle?.result?.experienceEarned }} EXP</span>
              </div>
              <div class="reward-item">
                <span class="reward-icon">💰</span>
                <span>{{ currentBattle?.result?.goldEarned }} G</span>
              </div>
            </div>
          </div>
          
          <PixelButton type="primary" @click="resetBattle">
            返回
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  </div>
</template>

<style scoped>
.boss-view {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-title {
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.idle-state {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.weekly-stats {
  display: flex;
  gap: 24px;
  justify-content: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background-color: var(--color-bg);
  border: 2px solid var(--color-text);
}

.stat-icon {
  font-size: 24px;
}

.stat-label {
  font-size: 10px;
  color: var(--color-text-muted);
}

.stat-value {
  font-size: 16px;
}

.battle-intro {
  text-align: center;
}

.intro-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px;
}

.boss-preview {
  font-size: 80px;
  animation: pulse 2s ease-in-out infinite;
}

h3 {
  font-size: 16px;
}

.intro-content p {
  font-size: 11px;
  color: var(--color-text-muted);
  max-width: 400px;
}

.fighting-state {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.battle-arena {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  min-height: 300px;
  position: relative;
}

.boss-container {
  text-align: center;
  transition: all 0.2s ease;
}

.boss-attacked {
  animation: shake 0.3s ease-in-out;
}

.boss-sprite {
  font-size: 100px;
  margin-bottom: 16px;
}

.boss-name {
  font-size: 14px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.player-attack {
  position: absolute;
  left: -50px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 40px;
  opacity: 0;
  transition: all 0.3s ease;
}

.player-attack.attacking {
  opacity: 1;
  left: 50%;
  transform: translate(-50%, -50%);
}

.battle-log {
  text-align: center;
  font-size: 12px;
  color: var(--color-accent);
}

.result-state {
  display: flex;
  justify-content: center;
}

.battle-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 20px;
  text-align: center;
}

.result-icon {
  font-size: 64px;
}

.result-title {
  font-size: 24px;
  text-transform: uppercase;
}

.result-stats {
  display: flex;
  gap: 32px;
}

.result-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.result-label {
  font-size: 10px;
  color: var(--color-text-muted);
}

.result-value {
  font-size: 18px;
}

.reward-box {
  padding: 16px;
  background-color: var(--color-bg);
  border: 4px solid var(--color-accent);
  width: 100%;
}

.reward-box h4 {
  font-size: 12px;
  color: var(--color-accent);
  margin-bottom: 12px;
}

.rewards {
  display: flex;
  justify-content: center;
  gap: 24px;
}

.reward-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.reward-icon {
  font-size: 20px;
}
</style>
