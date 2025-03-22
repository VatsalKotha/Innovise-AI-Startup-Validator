class ConstantData {
  static String server_url = 'https://innovise.onrender.com';
  static String market_gap_url = 'https://innovise-ai.onrender.com/analyze';
  static String chat_url = 'https://innovise-ai.onrender.com/startup-advice';
  static String business_pathway_url =
      'https://innovise-ai.onrender.com/generate-business-pathway';
  static int total_pages = 10;

  static List<String> appbar_titles = [
    'Startup Name',
    'Problem/Need',
    'Unique Selling Proposition',
    'Target Segment',
    'Industry',
    'Location',
    'Team Size',
    'Team Background',
    'Stage',
    'Revenue Model'
  ];

  static List<String> questions = [
    'What’s your startup name?',
    'What problem or need does your startup address?',
    'What makes your startup unique?',
    'Who is your  target audience?',
    'What industry do you operate in?',
    'Where is your startup based?',
    'How many people are on your team?',
    'What is your founding team’s background?',
    'What stage are you currently in?',
    'What revenue model does your startup use?'
  ];

  static List<String> tips = [
    'A catchy and memorable name helps boosts brand recognition.',
    'Clearly defining the problem helps in attracting the right customers.',
    'Highlighting your USP helps in standing out from the competition.',
    'Understanding your target segment ensures better product-market fit.',
    'Knowing your industry helps in understanding market trends.',
    'Location influences market access and operational costs.',
    'A well-sized team indicates the capacity to handle growth.',
    'A strong founding team attracts investors and partners.',
    'Identifying your stage helps in setting the right strategic goals.',
    'A clear revenue model is essential for financial sustainability.'
  ];

  static List<String> problems_addressed_choices = [
    'Inefficient Processes',
    'High Costs',
    'Lack of Access to Information',
    'Poor User Experience',
    'Health Issues',
    'Environmental Concerns'
  ];

  static List<String> startup_unique_reasons_choices = [
    'Innovative Technology',
    'Sustainability',
    'Cost-Effective Solution',
    'Superior Quality',
    'Niche Market Focus',
    'Exceptional Customer Service',
  ];

  static List<String> target_audience_choices = [
    'B2B - Business to Business',
    'B2C - Business to Consumer',
    'SMEs - Small & Medium Enterprises',
    'Enterprises',
    'Millennials',
    'Gen Z',
  ];

  static List<String> industry_operated_choices = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Retail',
    'Agriculture',
    'Entertainment',
    'E-Commerce',
    'Others'
  ];

  static List<String> team_size_choices = [
    '1-5',
    '6-10',
    '11-20',
    '21-50',
    '51-100',
    '100+'
  ];

  static List<String> team_background_choices = [
    'Technical Expertise',
    'Business/Entrepreneurial Experience',
    'Industry-Specific Knowledge',
    'Marketing and Sales',
  ];

  static List<String> stage_choices = [
    'Idea Stage - Conceptualization',
    'Early Stage - MVP Development',
    'Growth Stage - Scaling Operations',
    'Established - Market Expansion'
  ];

  static List<String> revenue_model_choices = [
    'Subscription Fees',
    'Direct Sales',
    'Advertising',
    'Transaction Fees',
    'Freemium',
  ];

  static List<String> sample_business_scenarios = [
    'Tech Startup',
    'E-commerce Business',
    'Food & Beverage',
    'Healthcare Startup',
    "Manufacturing Business",
  ];

  static List<String> sample_business_scenarios_prompt = [
    "I'm launching a SaaS product targeting small businesses. I need a business plan that includes financial projections, marketing strategies, and operational plans.",
    "I want to start an online store selling eco-friendly products. Help me create a business plan with a focus on marketing and logistics.",
    "I'm opening a café in a busy urban area. I need a business plan that covers financials, marketing, and operational workflows.",
    "I'm developing a telemedicine platform. I need a business plan that includes financial projections, regulatory compliance, and marketing strategies.",
    "I'm starting a small-scale manufacturing unit. Help me create a business plan with financials, supply chain management, and marketing."
  ];

  static List pathway_aspects = [
    {
      "title": "Financial Projections",
      "description":
          "Create detailed financial forecasts, including revenue, expenses, and cash flow.",
      "benefits": [
        "• Clear understanding of funding needs",
        "• Helps in securing investments",
        "• Identifies break-even points",
        "• Supports budgeting and planning"
      ],
      "considerations": [
        "• Requires accurate data inputs",
        "• May need professional assistance",
        "• Sensitive to market changes",
        "• Time-consuming to prepare"
      ]
    },
    {
      "title": "Marketing Strategies",
      "description":
          "Develop a comprehensive marketing plan to reach your target audience.",
      "benefits": [
        "• Increases brand visibility",
        "• Drives customer acquisition",
        "• Supports product launches",
        "• Builds long-term customer relationships"
      ],
      "considerations": [
        "• Requires market research",
        "• Can be costly depending on channels",
        "• Needs continuous optimization",
        "• Competitive landscape impacts results"
      ]
    },
    {
      "title": "Operational Plans",
      "description":
          "Outline the day-to-day operations, including workflows, resources, and logistics.",
      "benefits": [
        "• Improves efficiency and productivity",
        "• Reduces operational risks",
        "• Ensures resource allocation",
        "• Supports scalability"
      ],
      "considerations": [
        "• Requires detailed planning",
        "• Needs regular updates",
        "• Dependent on team coordination",
        "• May require technology investments"
      ]
    },
    {
      "title": "Industry Insights",
      "description":
          "Provide industry-specific insights to tailor your business plan.",
      "benefits": [
        "• Aligns with market trends",
        "• Identifies competitive advantages",
        "• Supports regulatory compliance",
        "• Enhances strategic decision-making"
      ],
      "considerations": [
        "• Requires up-to-date research",
        "• May need expert consultation",
        "• Industry-specific risks",
        "• Can be time-intensive"
      ]
    }
  ];
}
