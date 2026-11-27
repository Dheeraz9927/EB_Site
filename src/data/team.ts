// photo: optional headshot in public/assets/team/ (WebP), shown cropped in the avatar circle. Without one, initials are shown.
export interface TeamMember { name:string; initials:string; role:string; group:string; note:string; founder?:boolean; photo?:string }
export const team: TeamMember[] = [
  {name:'Aayush Khatri', initials:'AK', role:'Owner', group:'LEADERSHIP', note:'Auto · Home · Commercial', founder:true},
  {name:'Rishabh Vij', initials:'RV', photo:'/assets/team/rishabh-vij.webp', role:'Insurance Broker', group:'BROKER', note:'Personal guidance for your coverage'},
  {name:'Abhijeet Sawhney', initials:'AS', role:'Insurance Broker', group:'BROKER', note:'Personal guidance for your coverage'},
  {name:'Labia Chopra', initials:'LC', role:'Operations Support', group:'OPERATIONS SUPPORT', note:'Supporting your insurance journey'},
  {name:'Sofia Khatri', initials:'SK', role:'Operations Support', group:'OPERATIONS SUPPORT', note:'Supporting your insurance journey'},
  {name:'Dheeraz Vasireddy', initials:'DV', role:'Operations Support', group:'OPERATIONS SUPPORT', note:'Supporting your insurance journey'}
];
