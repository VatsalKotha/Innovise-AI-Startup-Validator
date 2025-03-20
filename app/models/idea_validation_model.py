from datetime import datetime

class IdeaValidation:
    def __init__(self, uid, success_score, metrics, detailed_analysis, swot, final_verdict):
        self.uid = uid
        self.success_score = success_score
        self.metrics = metrics
        self.detailed_analysis = detailed_analysis
        self.swot = swot
        self.final_verdict = final_verdict
        self.date_of_creation = datetime.utcnow()
    
    def to_dict(self):
        return {
            "uid": self.uid,
            "success_score": self.success_score,
            "metrics": self.metrics,
            "detailed_analysis": self.detailed_analysis,
            "swot": self.swot,
            "final_verdict": self.final_verdict,
            "date_of_creation": self.date_of_creation,
        }
