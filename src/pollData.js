// Published national polling behind the Common Ground Score for each preset topic.
// democratPct / republicanPct are the shares of each party (including leaners where the
// pollster reports them that way) who favor the policy as worded in the poll.
// When updating, use only figures published by the pollster and update `date` and `url`.

const PEW = 'Pew Research Center';

export const POLL_DATA = {
  Immigration: [
    { policy: 'Expanding the wall along the U.S.-Mexico border', democratPct: 27, republicanPct: 88, source: PEW, date: 'Jun 2025', url: 'https://www.pewresearch.org/politics/2025/06/17/views-of-the-trump-administrations-immigration-policies/' },
    { policy: 'Paying immigrants in the U.S. illegally to leave voluntarily', democratPct: 41, republicanPct: 58, source: PEW, date: 'Jun 2025', url: 'https://www.pewresearch.org/politics/2025/06/17/views-of-the-trump-administrations-immigration-policies/' },
    { policy: 'Increasing deportations of immigrants in the U.S. illegally (would improve the system)', democratPct: 30, republicanPct: 77, source: PEW, date: 'Feb 2024', url: 'https://www.pewresearch.org/politics/2024/02/15/what-would-improve-the-u-s-immigration-system/' },
    { policy: 'Hiring more immigration judges to decide asylum cases faster (would improve the system)', democratPct: 75, republicanPct: 47, source: PEW, date: 'Feb 2024', url: 'https://www.pewresearch.org/politics/2024/02/15/what-would-improve-the-u-s-immigration-system/' },
    { policy: 'Creating more ways to immigrate legally (would improve the system)', democratPct: 69, republicanPct: 43, source: PEW, date: 'Feb 2024', url: 'https://www.pewresearch.org/politics/2024/02/15/what-would-improve-the-u-s-immigration-system/' },
    { policy: 'Severe penalties for businesses that hire immigrants in the U.S. illegally (would improve the system)', democratPct: 30, republicanPct: 63, source: PEW, date: 'Feb 2024', url: 'https://www.pewresearch.org/politics/2024/02/15/what-would-improve-the-u-s-immigration-system/' },
  ],
  'Gun Control': [
    { policy: 'Preventing people with mental illnesses from buying guns', democratPct: 89, republicanPct: 88, source: PEW, date: 'Jun 2023', url: 'https://www.pewresearch.org/politics/2023/06/28/americans-views-of-specific-gun-policy-proposals/' },
    { policy: 'Raising the minimum age for buying guns to 21', democratPct: 90, republicanPct: 69, source: PEW, date: 'Jun 2023', url: 'https://www.pewresearch.org/politics/2023/06/28/americans-views-of-specific-gun-policy-proposals/' },
    { policy: 'Banning high-capacity ammunition magazines (more than 10 rounds)', democratPct: 85, republicanPct: 45, source: PEW, date: 'Jun 2023', url: 'https://www.pewresearch.org/politics/2023/06/28/americans-views-of-specific-gun-policy-proposals/' },
    { policy: 'Banning assault-style weapons', democratPct: 85, republicanPct: 42, source: PEW, date: 'Jun 2023', url: 'https://www.pewresearch.org/politics/2023/06/28/americans-views-of-specific-gun-policy-proposals/' },
    { policy: 'Shortening waiting periods for buying guns legally', democratPct: 16, republicanPct: 45, source: PEW, date: 'Jun 2023', url: 'https://www.pewresearch.org/politics/2023/06/28/americans-views-of-specific-gun-policy-proposals/' },
    { policy: 'Allowing people to carry concealed guns without a permit', democratPct: 9, republicanPct: 40, source: PEW, date: 'Jun 2023', url: 'https://www.pewresearch.org/politics/2023/06/28/americans-views-of-specific-gun-policy-proposals/' },
  ],
  Healthcare: [
    { policy: 'Extending the enhanced ACA marketplace tax credits', democratPct: 91, republicanPct: 63, source: 'KFF', date: 'Jun 2025', url: 'https://www.kff.org/affordable-care-act/poll-finding/kff-health-tracking-poll-aca-enhanced-subsidies/' },
    { policy: 'Allowing the federal government to negotiate drug prices', democratPct: 95, republicanPct: 71, source: 'KFF', date: 'Oct 2021', url: 'https://www.kff.org/health-costs/poll-finding/public-weighs-in-on-medicare-drug-negotiations/' },
    { policy: 'Work requirements for adults on Medicaid', democratPct: 47, republicanPct: 82, source: 'KFF', date: 'Feb 2025', url: 'https://www.kff.org/medicaid/kff-health-tracking-poll-public-views-on-potential-changes-to-medicaid/' },
    { policy: 'Federal government is responsible for ensuring all Americans have health coverage', democratPct: 90, republicanPct: 41, source: PEW, date: 'Nov 2025', url: 'https://www.pewresearch.org/short-reads/2025/12/10/most-americans-say-government-has-a-responsibility-to-ensure-health-care-coverage/' },
  ],
  'Climate Change': [
    { policy: 'Federal government encouraging wind and solar power production', democratPct: 85, republicanPct: 44, source: PEW, date: 'Mar 2026', url: 'https://www.pewresearch.org/science/2026/04/03/americans-shifting-views-on-energy-issues/' },
    { policy: 'Federal government encouraging nuclear power production', democratPct: 38, republicanPct: 54, source: PEW, date: 'Mar 2026', url: 'https://www.pewresearch.org/science/2026/04/03/americans-shifting-views-on-energy-issues/' },
    { policy: 'Prioritizing renewable energy over fossil fuels', democratPct: 83, republicanPct: 28, source: PEW, date: 'Mar 2026', url: 'https://www.pewresearch.org/science/2026/04/03/americans-shifting-views-on-energy-issues/' },
    { policy: 'Building more offshore wind farms', democratPct: 84, republicanPct: 52, source: PEW, date: 'May 2025', url: 'https://www.pewresearch.org/science/2025/06/05/views-on-trump-administration-energy-policies-and-priorities/' },
    { policy: 'Increasing oil and gas drilling on federal land', democratPct: 9, republicanPct: 57, source: PEW, date: 'May 2025', url: 'https://www.pewresearch.org/science/2025/06/05/views-on-trump-administration-energy-policies-and-priorities/' },
  ],
  'Abortion Rights': [
    { policy: 'Abortion should be legal in all or most cases', democratPct: 84, republicanPct: 36, source: PEW, date: 'Jan 2026', url: 'https://www.pewresearch.org/religion/fact-sheet/public-opinion-on-abortion/' },
    { policy: 'Medication abortion should be legal', democratPct: 73, republicanPct: 37, source: PEW, date: 'Apr 2024', url: 'https://www.pewresearch.org/politics/2024/05/13/broad-public-support-for-legal-abortion-persists-2-years-after-dobbs/' },
    { policy: 'A nationwide ban on mifepristone', democratPct: 19, republicanPct: 52, source: 'KFF', date: 'Jun 2026', url: 'https://www.kff.org/public-opinion/kff-health-tracking-poll-mifepristone-and-the-midterms/' },
    { policy: 'Criminalizing mailing abortion pills into states with abortion bans', democratPct: 21, republicanPct: 57, source: 'KFF', date: 'Jun 2026', url: 'https://www.kff.org/public-opinion/kff-health-tracking-poll-mifepristone-and-the-midterms/' },
  ],
  'Economy & Taxes': [
    { policy: 'Raising tax rates on large businesses and corporations', democratPct: 81, republicanPct: 43, source: PEW, date: 'Feb 2025', url: 'https://www.pewresearch.org/short-reads/2025/03/19/most-americans-continue-to-favor-raising-taxes-on-corporations-higher-income-households/' },
    { policy: 'Raising tax rates on household income over $400,000', democratPct: 74, republicanPct: 43, source: PEW, date: 'Feb 2025', url: 'https://www.pewresearch.org/short-reads/2025/03/19/most-americans-continue-to-favor-raising-taxes-on-corporations-higher-income-households/' },
    { policy: 'The increased tariffs on imported goods', democratPct: 7, republicanPct: 71, source: PEW, date: 'Jan 2026', url: 'https://www.pewresearch.org/politics/2026/02/04/americans-largely-disapprove-of-trumps-tariff-increases/' },
    { policy: 'The 2025 Republican budget and tax bill', democratPct: 5, republicanPct: 56, source: PEW, date: 'Jun 2025', url: 'https://www.pewresearch.org/short-reads/2025/06/17/how-americans-view-the-gops-budget-and-tax-bill/' },
  ],
  'Criminal Justice': [
    { policy: 'The death penalty for people convicted of murder', democratPct: 51, republicanPct: 84, source: PEW, date: 'Jul 2026', url: 'https://www.pewresearch.org/politics/2026/08/06/most-americans-favor-the-death-penalty-for-those-convicted-of-murder/' },
    { policy: 'Using the military or National Guard to assist local police in large cities', democratPct: 30, republicanPct: 82, source: 'AP-NORC', date: 'Aug 2025', url: 'https://apnorc.org/projects/most-say-crime-is-a-major-problem-in-americas-cities-but-few-support-a-federal-takeover-of-police-departments/' },
    { policy: 'Federal takeover of large-city police departments', democratPct: 15, republicanPct: 51, source: 'AP-NORC', date: 'Aug 2025', url: 'https://apnorc.org/projects/most-say-crime-is-a-major-problem-in-americas-cities-but-few-support-a-federal-takeover-of-police-departments/' },
    { policy: 'Increasing spending on policing in your area', democratPct: 34, republicanPct: 61, source: PEW, date: 'Oct 2021', url: 'https://www.pewresearch.org/short-reads/2021/10/26/growing-share-of-americans-say-they-want-more-spending-on-police-in-their-area/' },
  ],
  Education: [
    { policy: 'Education savings accounts (ESAs)', democratPct: 75, republicanPct: 74, source: 'EdChoice', date: '2025', url: 'https://www.edchoice.org/2025-educational-choices-blurred-political-lines-revisited/' },
    { policy: 'School vouchers', democratPct: 57, republicanPct: 77, source: 'EdChoice', date: '2025', url: 'https://www.edchoice.org/2025-educational-choices-blurred-political-lines-revisited/' },
    { policy: 'Eliminating the U.S. Department of Education', democratPct: 18, republicanPct: 39, source: 'Lake Research Partners / Tarrance Group for All4Ed', date: 'Nov 2024', url: 'https://www.edweek.org/policy-politics/most-voters-reject-trumps-push-to-cut-u-s-education-department-poll-finds/2025/01' },
    { policy: 'Banning cellphones during class in middle and high schools', democratPct: 74, republicanPct: 81, source: PEW, date: 'Jun 2026', url: 'https://www.pewresearch.org/short-reads/2026/07/29/more-americans-now-support-than-oppose-all-day-school-cellphone-bans/' },
    { policy: 'Banning cellphones for the whole school day', democratPct: 44, republicanPct: 55, source: PEW, date: 'Jun 2026', url: 'https://www.pewresearch.org/short-reads/2026/07/29/more-americans-now-support-than-oppose-all-day-school-cellphone-bans/' },
  ],
  'Social Media & Free Speech': [
    { policy: 'U.S. government restricting false information online', democratPct: 58, republicanPct: 43, source: PEW, date: 'Mar 2025', url: 'https://www.pewresearch.org/short-reads/2025/04/14/support-dips-for-us-government-tech-companies-restricting-false-or-violent-online-content/' },
    { policy: 'Tech companies restricting false information online', democratPct: 73, republicanPct: 47, source: PEW, date: 'Mar 2025', url: 'https://www.pewresearch.org/short-reads/2025/04/14/support-dips-for-us-government-tech-companies-restricting-false-or-violent-online-content/' },
    { policy: 'A U.S. ban on TikTok', democratPct: 30, republicanPct: 39, source: PEW, date: 'Mar 2025', url: 'https://www.pewresearch.org/short-reads/2025/03/25/fewer-americans-now-support-tiktok-ban-see-the-platform-as-a-national-security-threat-than-in-spring-2023/' },
    { policy: 'Requiring parental consent for minors to open social media accounts', democratPct: 83, republicanPct: 89, source: PEW, date: 'Jun 2026', url: 'https://www.pewresearch.org/short-reads/2026/07/01/majority-of-americans-support-banning-social-media-for-kids-under-16/' },
    { policy: 'Requiring age verification for social media', democratPct: 76, republicanPct: 81, source: PEW, date: 'Jun 2026', url: 'https://www.pewresearch.org/short-reads/2026/07/01/majority-of-americans-support-banning-social-media-for-kids-under-16/' },
    { policy: 'Banning social media for children under 16', democratPct: 54, republicanPct: 59, source: PEW, date: 'Jun 2026', url: 'https://www.pewresearch.org/short-reads/2026/07/01/majority-of-americans-support-banning-social-media-for-kids-under-16/' },
  ],
  'Drug Policy': [
    { policy: 'Legalizing marijuana', democratPct: 85, republicanPct: 40, source: 'Gallup', date: 'Oct 2025', url: 'https://news.gallup.com/poll/697445/americans-positive-progress-drugs.aspx' },
    { policy: 'Federal funding to expand substance abuse treatment to all who want it', democratPct: 92, republicanPct: 58, source: 'Program for Public Consultation (Univ. of Maryland)', date: 'Jun 2022', url: 'https://publicconsultation.org/health-care/large-bipartisan-majorities-favor-congress-funding-substance-abuse-treatment-for-all-who-want-it/' },
    { policy: 'Police diversion of people with addiction into treatment', democratPct: 90, republicanPct: 58, source: 'Program for Public Consultation (Univ. of Maryland)', date: 'Jun 2022', url: 'https://publicconsultation.org/health-care/large-bipartisan-majorities-favor-congress-funding-substance-abuse-treatment-for-all-who-want-it/' },
    { policy: 'Addiction treatment programs in prisons', democratPct: 89, republicanPct: 61, source: 'Program for Public Consultation (Univ. of Maryland)', date: 'Jun 2022', url: 'https://publicconsultation.org/health-care/large-bipartisan-majorities-favor-congress-funding-substance-abuse-treatment-for-all-who-want-it/' },
  ],
  'Voting Rights': [
    { policy: 'Requiring government-issued photo ID to vote', democratPct: 71, republicanPct: 95, source: PEW, date: 'Aug 2025', url: 'https://www.pewresearch.org/politics/2025/08/22/majority-of-americans-continue-to-back-expanded-early-voting-voting-by-mail-voter-id/' },
    { policy: 'Early in-person voting for at least two weeks before Election Day', democratPct: 89, republicanPct: 71, source: PEW, date: 'Aug 2025', url: 'https://www.pewresearch.org/politics/2025/08/22/majority-of-americans-continue-to-back-expanded-early-voting-voting-by-mail-voter-id/' },
    { policy: 'Letting any voter vote by mail without an excuse', democratPct: 83, republicanPct: 32, source: PEW, date: 'Aug 2025', url: 'https://www.pewresearch.org/politics/2025/08/22/majority-of-americans-continue-to-back-expanded-early-voting-voting-by-mail-voter-id/' },
    { policy: 'Automatic voter registration for eligible citizens', democratPct: 77, republicanPct: 42, source: PEW, date: 'Aug 2025', url: 'https://www.pewresearch.org/politics/2025/08/22/majority-of-americans-continue-to-back-expanded-early-voting-voting-by-mail-voter-id/' },
    { policy: 'Making Election Day a national holiday', democratPct: 76, republicanPct: 74, source: PEW, date: 'Aug 2025', url: 'https://www.pewresearch.org/politics/2025/08/22/majority-of-americans-continue-to-back-expanded-early-voting-voting-by-mail-voter-id/' },
    { policy: 'Removing inactive voters from registration lists', democratPct: 24, republicanPct: 63, source: PEW, date: 'Aug 2025', url: 'https://www.pewresearch.org/politics/2025/08/22/majority-of-americans-continue-to-back-expanded-early-voting-voting-by-mail-voter-id/' },
  ],
  'Foreign Policy': [
    { policy: 'Providing military aid to Ukraine', democratPct: 75, republicanPct: 51, source: 'Chicago Council on Global Affairs', date: 'Jul 2025', url: 'https://globalaffairs.org/research/public-opinion-survey/dramatic-rise-republican-support-ukraine' },
    { policy: 'Providing economic aid to Ukraine', democratPct: 79, republicanPct: 41, source: 'Chicago Council on Global Affairs', date: 'Jul 2025', url: 'https://globalaffairs.org/research/public-opinion-survey/dramatic-rise-republican-support-ukraine' },
    { policy: 'Additional sanctions on Russia', democratPct: 77, republicanPct: 74, source: 'Chicago Council on Global Affairs', date: 'Jul 2025', url: 'https://globalaffairs.org/research/public-opinion-survey/dramatic-rise-republican-support-ukraine' },
    { policy: 'Sending U.S. troops to help defend Ukraine', democratPct: 48, republicanPct: 20, source: 'Chicago Council on Global Affairs', date: 'Jul 2025', url: 'https://globalaffairs.org/research/public-opinion-survey/dramatic-rise-republican-support-ukraine' },
    { policy: 'NATO membership benefits the U.S.', democratPct: 82, republicanPct: 38, source: PEW, date: 'Mar 2026', url: 'https://www.pewresearch.org/short-reads/2026/04/06/republicans-have-become-less-likely-to-say-nato-membership-benefits-the-us/' },
    { policy: 'U.S. military aid to Israel for its war with Hamas', democratPct: 25, republicanPct: 50, source: PEW, date: 'Feb 2024', url: 'https://www.pewresearch.org/2024/03/21/views-of-the-u-s-role-in-the-israel-hamas-war/' },
  ],
};
