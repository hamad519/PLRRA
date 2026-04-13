export interface Blog {
  id: string;
  slug: string;
  title: string;
  date: string;
  imageUrl: string;
  shortDescription: string;
  content: string; // Full HTML content or markdown
}

export const blogs: Blog[] = [
  {
    id: '1',
    slug: 'new-season-championship-announcement',
    title: 'New Season Championship Announcement',
    date: 'October 26, 2024',
    imageUrl: '/competition-1.png',
    shortDescription: 'Get ready for the most anticipated event of the year! The PLRA is excited to announce the dates and venue for the upcoming National Long Range Shooting Championship.',
    content: `
      <p class="mb-4">The Pakistan Long Range Rifle Association (PLRA) is thrilled to announce the official dates and venue for the highly anticipated National Long Range Shooting Championship of the new season!</p>
      <p class="mb-4">This year's championship promises to be bigger and better, bringing together the nation's top marksmen to compete for glory and set new records. We encourage all members and enthusiasts to mark their calendars and prepare for an exhilarating display of skill and precision.</p>
      <h3 class="text-2xl font-bold text-plra-gold mb-3">Event Details:</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Dates:</strong> November 15-20, 2024</li>
        <li><strong>Venue:</strong> Army Marksmanship Unit, Jhelum</li>
        <li><strong>Categories:</strong> F-Class Open, FTR, ELR, and Tactical Rifle</li>
      </ul>
      <p class="mb-4">Registration will open next week. Stay tuned to our website and social media channels for more information on how to register, detailed match schedules, and accommodation options.</p>
      <p class="mb-4">We look forward to seeing you there and witnessing another chapter of excellence in Pakistani long-range shooting!</p>
      <p class="italic text-gray-400">For any inquiries, please contact our events coordinator.</p>
    `,
  },
  {
    id: '2',
    slug: 'training-workshop-success',
    title: 'Successful Beginner Training Workshop',
    date: 'October 18, 2024',
    imageUrl: '/training-pistol.png',
    shortDescription: 'Our recent beginner training workshop saw enthusiastic participation and great success, introducing new shooters to the fundamentals of long-range rifle shooting.',
    content: `
      <p class="mb-4">The PLRA successfully concluded its latest Beginner Training Workshop last weekend, welcoming a new cohort of aspiring long-range shooters. The workshop, held at the Islamabad Shooting Club, provided comprehensive instruction on firearm safety, basic marksmanship, and an introduction to long-range techniques.</p>
      <p class="mb-4">Participants engaged in hands-on sessions, learning about proper stance, breath control, trigger discipline, and basic ballistics. Our experienced instructors guided them through various drills, ensuring a safe and educational experience for everyone.</p>
      <h3 class="text-2xl font-bold text-plra-gold mb-3">Highlights:</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Interactive safety briefings</li>
        <li>Practical shooting exercises</li>
        <li>Personalized coaching from expert instructors</li>
        <li>Introduction to essential long-range gear</li>
      </ul>
      <p class="mb-4">The feedback from participants was overwhelmingly positive, with many expressing their excitement to continue their journey in long-range shooting. We are committed to fostering new talent and expanding the sport across Pakistan.</p>
      <p class="mb-4">Stay tuned for announcements on future training workshops!</p>
    `,
  },
  {
    id: '3',
    slug: 'pakistan-team-performance-european-championship',
    title: 'Pakistan Team Shines at European F-Class Championship',
    date: 'September 10, 2024',
    imageUrl: '/competition-2.png',
    shortDescription: 'The Pakistan FTR Team delivered an outstanding performance at the European F-Class Long Range Shooting Championships in Bisley, UK, securing multiple medals.',
    content: `
      <p class="mb-4">The Pakistan FTR Team has once again made the nation proud with an exceptional showing at the European F-Class Long Range Shooting Championships held in Bisley, UK. Competing against some of the world's best, our team demonstrated remarkable skill, discipline, and teamwork.</p>
      <p class="mb-4">The championship saw intense competition across various categories, and the Pakistani contingent rose to the occasion, bringing home a significant haul of medals and setting new personal bests.</p>
      <h3 class="text-2xl font-bold text-plra-gold mb-3">Key Achievements:</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li><strong>Team Event:</strong> Secured a Bronze Medal in the International Rutland Team Cup.</li>
        <li><strong>Individual Medals:</strong>
          <ul class="list-circle pl-6 mt-1 space-y-1">
            <li>3 Gold Medals</li>
            <li>5 Silver Medals</li>
            <li>5 Bronze Medals</li>
          </ul>
        </li>
        <li>Set 2 new GB F-Class Records.</li>
      </ul>
      <p class="mb-4">This performance is a testament to the rigorous training, strategic planning, and unwavering dedication of our shooters and coaching staff. The PLRA extends its heartfelt congratulations to the entire team for their hard work and for representing Pakistan with such distinction on the international stage.</p>
      <p class="mb-4">We continue to support our athletes in their pursuit of excellence and look forward to even greater achievements in future international competitions.</p>
    `,
  },
  {
    id: '4',
    slug: 'upcoming-national-records-review',
    title: 'Upcoming Review of National Records',
    date: 'August 20, 2024',
    imageUrl: '/records-main.png',
    shortDescription: 'The PLRA is preparing for its annual review of national long-range shooting records, inviting all record holders and aspiring marksmen to submit their achievements.',
    content: `
      <p class="mb-4">The Pakistan Long Range Rifle Association (PLRA) is pleased to announce the commencement of its annual review process for national long-range shooting records. This initiative aims to officially recognize and celebrate the outstanding achievements of Pakistani marksmen across various disciplines.</p>
      <p class="mb-4">We invite all current record holders and those who believe they have set new benchmarks in F-Class, ELR, ULR, Tactical Rifle, and Benchrest categories to submit their claims for review. The review process ensures that all records are accurately verified according to international standards.</p>
      <h3 class="text-2xl font-bold text-plra-gold mb-3">Submission Guidelines:</h3>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>All submissions must include official match results, witness statements, and any relevant photographic or video evidence.</li>
        <li>Submissions for the 2024 review cycle must be received by September 30, 2024.</li>
        <li>Detailed submission forms and criteria are available on the "Past Results & Records" section of our website.</li>
      </ul>
      <p class="mb-4">The updated list of national records will be published on our website and celebrated at our annual awards ceremony. This is a fantastic opportunity to etch your name in the history of Pakistani long-range shooting!</p>
      <p class="mb-4">For further details or assistance with your submission, please contact the PLRA Records Committee.</p>
    `,
  },
];