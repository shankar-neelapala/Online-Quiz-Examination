package com.project.Backend.service;

import java.io.IOException;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.Backend.model.Questions;
import com.project.Backend.model.Schedule;
import com.project.Backend.model.Students;
import com.project.Backend.repository.QuestionsRepo;
import com.project.Backend.repository.ScheduleRepo;
import com.project.Backend.repository.StudentRepo;
import com.project.Backend.security.JwtUtil;

@Service
public class StudentServicesConsumer {
	
	@Value("${imgbb.api.key}")
    private String imgbbApiKey;
	
	@Autowired
	private KafkaTemplate<String, Object> kafkaTemplate;
	
	private final ObjectMapper objectMapper = new ObjectMapper();
    private final StudentRepo studentRepo;
    private final ScheduleRepo schr;
    private final QuestionsRepo qr;
    private final CommonFuncServicesConsumer cfs;
    
    public StudentServicesConsumer(StudentRepo studentRepo,ScheduleRepo schr,QuestionsRepo qr,CommonFuncServicesConsumer cfs) {
        this.studentRepo = studentRepo;
        this.qr = qr;
        this.schr=schr;
        this.cfs = cfs;}
	
	@KafkaListener(topics = "student-create-topic", groupId = "quiz-group")
    public void createstu(String message) {
        try {
            Map<String, Object> data = objectMapper.readValue(message, new TypeReference<Map<String, Object>>() {});
            Students student = new Students();
            student.setName((String) data.get("name"));
            student.setUsername((String) data.get("username"));
            student.setBatch((String) data.get("batch"));
            student.setRegulation((String) data.get("regulation"));
            student.setBranch((String) data.get("branch"));
            student.setSemester((String) data.get("semester"));
            student.setSection((String) data.get("section"));
            student.setRole((String) data.get("role"));
            if (data.containsKey("image")) {
                String base64Image = (String) data.get("image");
                MultipartFile file = base64ToMultipartFile(base64Image, "student.jpg");
                String imageUrl = cfs.uploadImage(file, imgbbApiKey);
                student.setImage(imageUrl);
            }
            studentRepo.save(student);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

	private MultipartFile base64ToMultipartFile(String base64, String filename) throws IOException {
	    byte[] decoded = Base64.getDecoder().decode(base64);
	    return new MockMultipartFile(filename, filename, "image/jpeg", decoded);
	}

	
	@KafkaListener(topics = "stulogin-request-topic", groupId = "quiz-group")
	public void loginstu(String message) {
		Map<String, Object> data;
		try {
			data = objectMapper.readValue(message, new TypeReference<Map<String, Object>>() {});
			String reqId = (String) data.get("id");
			String username = (String) data.get("username");
			String password = (String) data.get("password");
			List<Object> l = studentRepo.findByUsernameAndPassword(username, password);
			if(!l.isEmpty()) {
					Students stu = (Students) l.get(0);        
					String role = stu.getRole();
					JwtUtil jw = new JwtUtil();
					HashMap<String,Object> hm = new HashMap<>();
					hm.put("token", jw.generateToken(username,role));
					hm.put("details", l);
					try {
						String json = objectMapper.writeValueAsString(hm);
						kafkaTemplate.send("student-login-response",reqId,json);
					} catch (JsonProcessingException e) {
						e.printStackTrace();
					}
			}
			else {
				Map<String, Object> errorResponse = Map.of(
					    "error", "Invalid credentials"
					);
				kafkaTemplate.send("student-login-response",reqId,errorResponse);
			}
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (JsonProcessingException e) {
			e.printStackTrace();
		}
	}
	
	@KafkaListener(topics = "get-exams-topic", groupId = "quiz-group")
	public void getexams(String message) {
		Map<String, Object> data;
		try {
			data = objectMapper.readValue(message, new TypeReference<Map<String, Object>>() {});
			String reqId = (String) data.get("id");
			String branch = (String) data.get("branch");
			String semester = (String) data.get("semester");
			String date = (String) data.get("date");
			List<Schedule> sh = schr.findByBranchAndSemesterAndDate(branch,semester,date);
			String jsonResponse = objectMapper.writeValueAsString(sh);
			kafkaTemplate.send("get-exam-response",reqId,jsonResponse);
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}
	
	
	@KafkaListener(topics = "get-examsque-topic", groupId = "quiz-group")
	public void getAllexamQuestions(String message) {
		Map<String, Object> data;
		try {
			data = objectMapper.readValue(message, new TypeReference<Map<String, Object>>() {});
			String reqId = (String) data.get("id");
			String batch = (String) data.get("batch");
			String branch = (String) data.get("branch");
			String coursecode = (String) data.get("coursecode");
			String examtype = (String) data.get("examtype");
			List<Questions> q = qr.findQuestions(batch,examtype,branch,coursecode);
			List<Questions> shuffle = shuffleQuestions(q);
			String jsonResponse = objectMapper.writeValueAsString(shuffle);
			kafkaTemplate.send("get-examque-response",reqId,jsonResponse);
		}
		catch(Exception e) {
			e.printStackTrace();
		}
	}

	public List<Questions> shuffleQuestions(List<Questions> q) {
		Collections.shuffle(q);
		for (Questions que : q) {
            Collections.shuffle(que.getOptions());
        }
		return q;
	}
}
