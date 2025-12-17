import type { Exercise } from '../types';

export const exercises: Exercise[] = [
  // CHEST EXERCISES
  {
    id: 'bench-press',
    name: 'Barbell Bench Press',
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: 'barbell',
    formTips: [
      'Keep your feet flat on the floor',
      'Retract shoulder blades and arch upper back slightly',
      'Lower the bar to mid-chest with control',
      'Press straight up, locking out at the top',
      'Keep wrists straight and grip the bar firmly',
    ],
  },
  {
    id: 'incline-db-press',
    name: 'Incline Dumbbell Press',
    muscleGroups: ['chest', 'shoulders', 'triceps'],
    equipment: 'dumbbell',
    formTips: [
      'Set bench to 30-45 degree incline',
      'Start with dumbbells at shoulder level',
      'Press up and slightly inward',
      'Lower with control, feeling stretch in upper chest',
      'Keep core engaged throughout',
    ],
  },
  {
    id: 'cable-flyes',
    name: 'Cable Flyes',
    muscleGroups: ['chest'],
    equipment: 'cable',
    formTips: [
      'Set pulleys to chest height for mid-chest focus',
      'Keep slight bend in elbows throughout',
      'Squeeze chest at the center of movement',
      'Control the weight on the way back',
      'Avoid letting shoulders roll forward',
    ],
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    muscleGroups: ['triceps', 'chest', 'shoulders'],
    equipment: 'bodyweight',
    formTips: [
      'Keep body upright for tricep focus',
      'Lower until upper arms are parallel to floor',
      'Press up through palms, locking out arms',
      'Keep shoulders down and back',
      'Add weight once bodyweight becomes easy',
    ],
  },
  {
    id: 'overhead-tricep-extension',
    name: 'Overhead Tricep Extension',
    muscleGroups: ['triceps'],
    equipment: 'dumbbell',
    formTips: [
      'Keep upper arms stationary beside head',
      'Lower weight behind head with control',
      'Extend fully, squeezing triceps at top',
      'Keep elbows pointed forward, not flared',
      'Use a single dumbbell or rope attachment',
    ],
  },
  {
    id: 'tricep-pushdowns',
    name: 'Tricep Pushdowns',
    muscleGroups: ['triceps'],
    equipment: 'cable',
    formTips: [
      'Keep elbows pinned to your sides',
      'Push down until arms are fully extended',
      'Squeeze triceps at the bottom',
      'Control the weight on the way up',
      'Keep torso upright, avoid leaning',
    ],
  },

  // BACK EXERCISES
  {
    id: 'deadlift',
    name: 'Conventional Deadlift',
    muscleGroups: ['back', 'hamstrings', 'glutes', 'traps'],
    equipment: 'barbell',
    formTips: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Hinge at hips, keeping back flat',
      'Grip bar just outside knees',
      'Drive through heels, keeping bar close to body',
      'Lock out hips and knees together at top',
    ],
  },
  {
    id: 'pull-ups',
    name: 'Pull-Ups',
    muscleGroups: ['lats', 'biceps', 'back'],
    equipment: 'bodyweight',
    formTips: [
      'Grip bar slightly wider than shoulder width',
      'Start from dead hang with arms extended',
      'Pull chest toward bar, leading with elbows',
      'Lower with control to full extension',
      'Avoid swinging or kipping',
    ],
  },
  {
    id: 'barbell-rows',
    name: 'Barbell Rows',
    muscleGroups: ['back', 'lats', 'biceps', 'traps'],
    equipment: 'barbell',
    formTips: [
      'Hinge forward to about 45 degrees',
      'Keep back flat and core braced',
      'Pull bar to lower chest/upper abs',
      'Squeeze shoulder blades together at top',
      'Lower with control, maintaining position',
    ],
  },
  {
    id: 'face-pulls',
    name: 'Face Pulls',
    muscleGroups: ['shoulders', 'traps', 'back'],
    equipment: 'cable',
    formTips: [
      'Set cable at face height',
      'Use rope attachment with overhand grip',
      'Pull toward face, separating hands',
      'Squeeze rear delts and hold briefly',
      'Keep elbows high throughout movement',
    ],
  },
  {
    id: 'barbell-curls',
    name: 'Barbell Curls',
    muscleGroups: ['biceps', 'forearms'],
    equipment: 'barbell',
    formTips: [
      'Stand tall with arms extended',
      'Keep elbows pinned to sides',
      'Curl bar in arc toward shoulders',
      'Squeeze biceps at top',
      'Lower with control, full extension',
    ],
  },
  {
    id: 'hammer-curls',
    name: 'Hammer Curls',
    muscleGroups: ['biceps', 'forearms'],
    equipment: 'dumbbell',
    formTips: [
      'Hold dumbbells with neutral grip (palms facing)',
      'Keep elbows stationary at sides',
      'Curl weight up, maintaining neutral wrist',
      'Squeeze at top, lower slowly',
      'Can alternate arms or curl together',
    ],
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    muscleGroups: ['lats', 'biceps', 'back'],
    equipment: 'cable',
    formTips: [
      'Grip bar slightly wider than shoulders',
      'Lean back slightly, chest up',
      'Pull bar to upper chest',
      'Squeeze lats at bottom of movement',
      'Control the weight back up',
    ],
  },

  // SHOULDER EXERCISES
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    muscleGroups: ['shoulders', 'triceps', 'traps'],
    equipment: 'barbell',
    formTips: [
      'Start bar at collar bone height',
      'Grip slightly wider than shoulders',
      'Press straight up, moving head back then forward',
      'Lock out overhead, bar over mid-foot',
      'Keep core tight throughout',
    ],
  },
  {
    id: 'lateral-raises',
    name: 'Lateral Raises',
    muscleGroups: ['shoulders'],
    equipment: 'dumbbell',
    formTips: [
      'Start with dumbbells at sides',
      'Raise arms out to sides until parallel',
      'Lead with elbows, not hands',
      'Keep slight bend in elbows',
      'Lower with control, avoid momentum',
    ],
  },
  {
    id: 'front-raises',
    name: 'Front Raises',
    muscleGroups: ['shoulders'],
    equipment: 'dumbbell',
    formTips: [
      'Start with dumbbells in front of thighs',
      'Raise one or both arms to eye level',
      'Keep arms straight with slight elbow bend',
      'Lower slowly with control',
      'Avoid swinging or using momentum',
    ],
  },
  {
    id: 'rear-delt-flyes',
    name: 'Rear Delt Flyes',
    muscleGroups: ['shoulders', 'back'],
    equipment: 'dumbbell',
    formTips: [
      'Bend over to near parallel with floor',
      'Let dumbbells hang below chest',
      'Raise arms out to sides, squeezing rear delts',
      'Keep slight bend in elbows',
      'Focus on squeezing shoulder blades',
    ],
  },
  {
    id: 'arnold-press',
    name: 'Arnold Press',
    muscleGroups: ['shoulders', 'triceps'],
    equipment: 'dumbbell',
    formTips: [
      'Start with dumbbells at shoulder height, palms facing you',
      'Press up while rotating palms outward',
      'Finish with palms facing forward at top',
      'Reverse motion on the way down',
      'Keep movement smooth and controlled',
    ],
  },

  // AB EXERCISES
  {
    id: 'cable-crunches',
    name: 'Cable Crunches',
    muscleGroups: ['abs'],
    equipment: 'cable',
    formTips: [
      'Kneel below high cable pulley',
      'Hold rope behind head',
      'Crunch down, bringing elbows to knees',
      'Focus on contracting abs, not pulling with arms',
      'Control the weight back up',
    ],
  },
  {
    id: 'planks',
    name: 'Planks',
    muscleGroups: ['abs', 'obliques'],
    equipment: 'bodyweight',
    formTips: [
      'Support body on forearms and toes',
      'Keep body in straight line from head to heels',
      'Engage core by bracing like taking a punch',
      'Keep hips level, dont sag or pike',
      'Breathe steadily throughout hold',
    ],
  },
  {
    id: 'hanging-leg-raises',
    name: 'Hanging Leg Raises',
    muscleGroups: ['abs', 'obliques'],
    equipment: 'bodyweight',
    formTips: [
      'Hang from bar with arms extended',
      'Keep legs straight or slightly bent',
      'Raise legs to parallel or higher',
      'Lower with control, avoid swinging',
      'Focus on using abs, not hip flexors',
    ],
  },

  // LEG EXERCISES
  {
    id: 'squats',
    name: 'Barbell Back Squat',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: 'barbell',
    formTips: [
      'Bar on upper back, not neck',
      'Feet shoulder-width apart, toes slightly out',
      'Break at hips and knees simultaneously',
      'Descend until thighs are parallel or below',
      'Drive through whole foot, keeping chest up',
    ],
  },
  {
    id: 'romanian-deadlifts',
    name: 'Romanian Deadlifts',
    muscleGroups: ['hamstrings', 'glutes', 'back'],
    equipment: 'barbell',
    formTips: [
      'Hold bar at hip height',
      'Push hips back, keeping bar close to legs',
      'Lower until you feel hamstring stretch',
      'Keep back flat throughout',
      'Drive hips forward to return to start',
    ],
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: 'machine',
    formTips: [
      'Position feet shoulder-width on platform',
      'Lower platform with control',
      'Dont let knees cave inward',
      'Press through whole foot',
      'Dont lock knees completely at top',
    ],
  },
  {
    id: 'leg-curls',
    name: 'Lying Leg Curls',
    muscleGroups: ['hamstrings'],
    equipment: 'machine',
    formTips: [
      'Lie face down, pad above heels',
      'Curl weight up toward glutes',
      'Squeeze hamstrings at top',
      'Lower with control',
      'Keep hips pressed into bench',
    ],
  },
  {
    id: 'calf-raises',
    name: 'Standing Calf Raises',
    muscleGroups: ['calves'],
    equipment: 'machine',
    formTips: [
      'Stand with balls of feet on platform edge',
      'Lower heels for full stretch',
      'Rise up on toes as high as possible',
      'Hold peak contraction briefly',
      'Keep knees straight but not locked',
    ],
  },
  {
    id: 'lunges',
    name: 'Walking Lunges',
    muscleGroups: ['quads', 'glutes', 'hamstrings'],
    equipment: 'dumbbell',
    formTips: [
      'Take a large step forward',
      'Lower back knee toward floor',
      'Keep front knee over ankle, not past toes',
      'Push through front foot to step forward',
      'Keep torso upright throughout',
    ],
  },
  {
    id: 'leg-extensions',
    name: 'Leg Extensions',
    muscleGroups: ['quads'],
    equipment: 'machine',
    formTips: [
      'Sit with back against pad',
      'Hook ankles under roller pad',
      'Extend legs fully, squeezing quads',
      'Lower with control',
      'Dont swing or use momentum',
    ],
  },
  {
    id: 'hip-thrusts',
    name: 'Hip Thrusts',
    muscleGroups: ['glutes', 'hamstrings'],
    equipment: 'barbell',
    formTips: [
      'Upper back on bench, feet flat on floor',
      'Bar across hip crease with pad',
      'Drive through heels, lifting hips',
      'Squeeze glutes hard at top',
      'Lower with control, keep tension',
    ],
  },
];

export const exerciseMap = new Map(exercises.map((e) => [e.id, e]));

export function getExercise(id: string): Exercise | undefined {
  return exerciseMap.get(id);
}

export function getExercisesByMuscle(muscle: string): Exercise[] {
  return exercises.filter((e) => e.muscleGroups.includes(muscle as any));
}
