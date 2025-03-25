const Company = require('../models/Company');
const Session = require('../models/Session');

exports.getSessions = async (req, res, next) => {
    let query;

    if (req.user.role !== 'admin') {
        query = Session.find({ user: req.user.id })
            .populate({
                path: 'company',
                select: 'companyName address website tel'
            })
            .populate({
                path: 'user', // If session references a user
                select: 'name email'
            });
    } else {
        if (req.params.CompanyId) {
            query = Session.find({ company: req.params.CompanyId })
                .populate({
                    path: 'company',
                    select: 'companyName address website tel'
                })
                .populate({
                    path: 'user',
                    select: 'name email'
                });
        } else {
            query = Session.find()
                .populate({
                    path: 'company',
                    select: 'companyName address website tel'
                })
                .populate({
                    path: 'user',
                    select: 'name email'
                });
        }
    }

    try {
        const sessions = await query;

        res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'Cannot find sessions'
        });
    }
};

exports.getSession = async (req, res, next) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate({
                path: 'company',
                select: 'companyName address website tel'
            })
            .populate({
                path: 'user',
                select: 'name email'
            });

        if (!session) {
            return res.status(400).json({ success: false, msg: 'Not found session' });
        }

        res.status(200).json({ success: true, data: session });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, msg: 'Cannot find session' });
    }
};


exports.addSession = async (req,res,next)=>{
    try {
        const company = await Company.findById(req.params.CompanyId);
        if(!company){
            return res.status(404).json({success:false,message:'No company found'});

        }
        const interviewDate = req.body.sessionDate;
        if ((interviewDate > '2022-05-13' || interviewDate < '2022-05-10')) {
            return res.status(400).json({ message: "Invalid date range." });
          }
        
        req.body.company = req.params.CompanyId;
        const existsess = await Session.find({user:req.user.id});
        req.body.user=req.user.id;
        if(req.user.role!=='admin'&&existsess.length>=3){
            return res.status(400).json({success:false,message:'User has exeed booking limit'});
        }
        const session = await Session.create(req.body);
        res.status(200).json({success:true,data:session});

    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:'Cannot create session'});
    }
   
};

exports.updateSession = async (req,res,next )=>{
    try {
        const interviewDate = req.body.sessionDate;
        if (interviewDate > '2022-05-13' || interviewDate < '2022-05-10') {
            return res.status(400).json({ message: "Invalid date range." });
        }

        let session = await Session.findById(req.params.id);
        if(!session) return res.status(400).json({success:false,msg:'No session with this id'});
        if(session.user.toString()!==req.user.id&&req.user.role !=='admin'){
            return res.status(401).json({
                success:false,msg:'User is not authorized'
            });
        }
        session = await Session.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators :true
        });
        res.status(200).json({
            success:true,
            data:session
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msge:'Cannot update'
        });
    }
};

exports.deleteSession = async (req,res,next)=>{
    try {
        const session = await Session.findById(req.params.id);
        if(!session) {
            return res.status(400).json({
                success:false,
                msg:'No session with this id'
            });
        }
        if(session.user.toString()!==req.user.id&&req.user.role !=='admin'){
            return res.status(401).json({
                success:false,msg:'User is not authorized'
            });
        }

        await session.deleteOne();
        res.status(200).json({
            success:true,
            data :{}
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            msg:'cannot delete'
        });
        
    }
};





