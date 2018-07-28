Vue.component('tabs', {
    template: `
        <div class="tab-container">
            <div>
              <ul class="tab-row">
                <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                    <a :href="tab.href" @click="selectTab(tab)"><div class="tab-title">{{ tab.name }}</div></a>
                </li>
              </ul>
            </div>

            <div class="tabs-details">
                <slot></slot>
            </div>
        </div>
    `,
    data() {
        return {tabs: [] };
    },
    created() {
        this.tabs = this.$children;
    },
    methods: {
        selectTab(selectedTab) {
            this.tabs.forEach(tab => {
                tab.isActive = (tab.name == selectedTab.name);
            });
        }
    }
});

Vue.component('tab', {
    template: `
        <div v-show="isActive">
            <slot></slot>
        </div>`,
    props: {
        name: { required: true },
        selected: { default: false}
    },
    data() {
        return {
            isActive: false,
        };
    },
    computed: {
        href() {
            return '#' + this.name.toLowerCase().replace(/ /g, '-');
        }
    },
    mounted() {
        this.isActive = this.selected;
    }
});

var vm = new Vue({
    el: "#app",
    data: {
        showMenu: false,
        siteSections: [
            { id: 1, title: "Samples", link: '#samples' },
            { id: 2, title: "About", link: '#about' },
            { id: 3, title: "Learning experiences", link: '#learning-experiences' },
            { id: 4, title: "Work philosophy", link: '#work-philosophy' },
            { id: 5, title: "Work History", link: '#work-history' },
            { id: 6, title: "Contact", link: '#contact' },
        ],
        socialMedia: [
            { id: 1, title: "Twitter", link: 'https://twitter.com/KyleBRollins' },
            { id: 2, title: "LinkedIn", link: 'https://www.linkedin.com/in/kyle-blank-rollins/' },
            { id: 3, title: "GitHub", link: 'https://github.com/KyleBlankRollins' },
        ],
        techImages: [
            { id: 1, title: "Gimo Games Style Guide", pic: "Gimo_Games_Style_Guide.png", doc: "Gimo_Games_Style_Guide.pdf" },
            { id: 2, title: "Chi Tester User Guide", pic: "Chi_Tester.png", doc: "Chi_Tester_User_Guide.pdf" },
            { id: 3, title: "Shepherd Union Building Manager Handbook", pic: "Shepherd_Union_Building_Manager_Handbook.png", doc: "Shepherd_Union_Building_Manager_Handbook.pdf" },
            { id: 4, title: "Allegany College Case Study", pic: "Allegany_Image.jpg", doc: "Allegany_College_Case_Study.pdf" },
            { id: 5, title: "Proposal Template", pic: "Proposal_Template.png", doc: "Proposal_Template.pdf" },
        ],
        designImages: [
            { id: 1, title: "Quick Tips - Front", pic: "Quick_tips_front.png", doc: "Quick_tips_front.pdf" },
            { id: 2, title: "Quick Tips - Back", pic: "Quick_tips_back.png", doc: "Quick_tips_back.pdf" },
            { id: 3, title: "WTD Agenda", pic: "WTD_Apr_Agenda.png", doc: "WTD_Apr_Agenda.pdf" },
            { id: 4, title: "WTD Reference Sheet", pic: "WTD_Jan_Reference_Sheet.png", doc: "WTD_Jan_Reference_Sheet.pdf" },
            { id: 5, title: "WTD Role Card", pic: "WTD_Jan_Role-ProductOwner.png", doc: "WTD_Jan_Role-ProductOwner" },
        ],
        pubLinks: [
            { id: 1, title: "The Fastest-Growing Academic Programs of 2015", link: "http://www.economicmodeling.com/2016/09/09/fastest-growing-academic-programs-2015/", text: "With new IPEDS data at hand, I set out to determine which academic programs grew the most compared to 2014. There are the expected results, but also some surprises." },
            { id: 2, title: "Exploring the Demand for MBA Graduates", link: "http://www.economicmodeling.com/2016/08/08/exploring-mba-demand/", text: "It's no secret that the MBA is a popular degree choice. In fact, it's the most popular post-grad in the country. Why is that? I analyzed Emsi's Job Posting Analytics to find out." },
            { id: 3, title: "The Rise of Postsecondary Certificates in the US", link: "http://www.economicmodeling.com/2016/05/31/the-rise-of-postsecondary-certificates-in-the-us/", text: "Four-year degrees are expensive. That's why many displaced workers looked to postsecondary certificates during and after the great recession. But what happened as the economy improved and what does it mean for higher education institutions?" },
            { id: 4, title: "Guided Pathways: Stories From Pilot Colleges", link: "http://www.economicmodeling.com/2016/05/17/guided-pathways-stories-pilot-colleges/", text: "How does the Guided Pathways model benefit students and community colleges? I asked some college leaders at pathways pilot colleges to find out." },
            { id: 5, title: "State of the Tech Industry: 7 Takeaways from CompTIA’s Cyberstates 2016 Report", link: "http://www.economicmodeling.com/2016/03/30/state-tech-industry-7-takeaways-comptias-cyberstates-2016-report/", text: "The tech industry rapidly changes, which is why CompTIA releases a major industry report every year. Don't have time to dig through it all? I summarized seven main points to pay attention to." },
            { id: 6, title: "The Proliferation of General Studies Degrees", link: "http://www.economicmodeling.com/2016/03/22/proliferation-general-studies-degrees/", text: "What drove the massive completions growth in general studies after the great recession? I compiled and analyzed the data to identify trends and pose some answers." },
            { id: 7, title: "8 Fast-Growing College Programs Not Keeping Up With Employer Demand", link: "http://www.economicmodeling.com/2016/03/03/8-fast-growing-college-programs-not-keeping-up-with-employer-demand/", text: "Not all academic programs are in demand. However, some are in so much demand that there simply aren't enough graduates to fill open positions. Check out this infographic to learn more." },
            { id: 8, title: "From Provo to Peoria, Ranking the Largest 150 Metros for Regional Competitiveness", link: "http://www.economicmodeling.com/2016/02/12/from-provo-to-peoria-ranking-the-largest-150-metros-for-regional-competitiveness/", text: "Once I adjusted for national growth using Emsi's labor market data, it became clear which metros are more competitive than the rest. See the interactive map to see which metros are at the top." },
        ],
        jobHistory: [
            { id: 1, employer: "3M", link: 'https://www.3m.com/3M/en_US/health-information-systems-us/', job: "Technical Writer", desc: "Coordinated with developers to create release notes and other documentation for a dozen healthcare software products.", skills: "research, project management, content reuse" },
            { id: 2, employer: "eBay", link: 'https://www.ebay.com/', job: "Editor", desc: "As part of the HR user experience team, gathered, curated, wrote, and edited content for a complete intranet overhaul.", skills: "interviewing, project management, collaborative writing" },
            { id: 3, employer: "Emsi", link: 'http://www.economicmodeling.com/', job: "Technical Writer", desc: "Wrote economic development blog posts, created and edited RFPs and RFP templates, and conducted economic research.", skills: "document management, interviewing, SEO" },
            { id: 4, employer: "Purch", link: 'http://www.purch.com/', job: "Electronics Writer/Reviewer", desc: "Benchmarked electronics hardware, researched product markets, and targeted product reviews to specific audiences.", skills: "SEO, audience analysis, research" },
            { id: 5, employer: "Weber State University", link: 'https://www.weber.edu/', job: "Building Manager", desc: "Managed venue events and coordinated with other staff to ensure public safety in a multi-million-dollar building. Contributed to documenting role responsibilities.", skills: "communication, organization, leadership" },
        ],
    },
});
