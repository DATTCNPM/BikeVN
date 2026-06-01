package com.backend.bikerental.service;

import com.backend.bikerental.exception.AppException;
import com.backend.bikerental.exception.ErrorCode;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class VehicleImageStorageService {
    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        try {
            Path rootPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path imageDir = rootPath.resolve("vehicle-images");
            Files.createDirectories(imageDir);

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
            }

            String storedFilename = UUID.randomUUID() + extension;
            Path targetPath = imageDir.resolve(storedFilename);
            file.transferTo(targetPath);

            return "/uploads/vehicle-images/" + storedFilename;
        } catch (IOException exception) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    public void delete(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        try {
            String relativePath = imageUrl.startsWith("/") ? imageUrl.substring(1) : imageUrl;
            Path rootPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = rootPath.resolve(relativePath.replaceFirst("^uploads/", ""));
            Files.deleteIfExists(filePath);
        } catch (IOException exception) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }
}