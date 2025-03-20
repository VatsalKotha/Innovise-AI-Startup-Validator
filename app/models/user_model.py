class User:
    def __init__(self, name: str, email: str, password: str, date_of_join: str, is_data_filled: bool, 
                 startup_name: str, problems_addressed: list, startup_unique_reasons: list,
                 target_audiences: list, industry_operated: str, startup_location: str, 
                 team_size: str, founding_team_background: list, stage: str, revenue_model: list):
     
        self.name = name
        self.email = email
        self.password = password
        self.date_of_join = date_of_join
        self.is_data_filled = is_data_filled
        self.startup_name = startup_name
        self.problems_addressed = problems_addressed
        self.startup_unique_reasons = startup_unique_reasons
        self.target_audiences = target_audiences
        self.industry_operated = industry_operated
        self.startup_location = startup_location
        self.team_size = team_size
        self.founding_team_background = founding_team_background
        self.stage = stage
        self.revenue_model = revenue_model

    def to_dict(self):
        return {
           
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "date_of_join": self.date_of_join,
            "is_data_filled": self.is_data_filled,
            "startup_name": self.startup_name,
            "problems_addressed": self.problems_addressed,
            "startup_unique_reasons": self.startup_unique_reasons,
            "target_audiences": self.target_audiences,
            "industry_operated": self.industry_operated,
            "startup_location": self.startup_location,
            "team_size": self.team_size,
            "founding_team_background": self.founding_team_background,
            "stage": self.stage,
            "revenue_model": self.revenue_model
        }

    @staticmethod
    def from_dict(data):
        return User(
        
            name=data.get("name", ""),
            email=data.get("email", ""),
            password=data.get("password", ""),
            date_of_join=data.get("date_of_join", ""),
            is_data_filled=data.get("is_data_filled", False),
            startup_name=data.get("startup_name", ""),
            problems_addressed=data.get("problems_addressed", []),
            startup_unique_reasons=data.get("startup_unique_reasons", []),
            target_audiences=data.get("target_audiences", []),
            industry_operated=data.get("industry_operated", ""),
            startup_location=data.get("startup_location", ""),
            team_size=data.get("team_size", ""),
            founding_team_background=data.get("founding_team_background", []),
            stage=data.get("stage", ""),
            revenue_model=data.get("revenue_model", [])
        )