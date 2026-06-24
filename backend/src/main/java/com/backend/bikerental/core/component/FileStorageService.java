package com.backend.bikerental.core.component;

import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
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
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileStorageService {
    @Value("${app.upload-dir:upload}")
    String uploadDir;

    public String storeVehicleImage(MultipartFile file)
    {
        return storeFile(file, "vehicle-images");
    }

    public List<String> storeVehicleReturnImages(List<MultipartFile> files)
    {
        if (files == null || files.isEmpty())
        {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        return files.stream()
                .map(file -> storeFile(file, "vehicle-return-images"))
                .collect(Collectors.toList());
    }

    private String storeFile(MultipartFile file, String subFolder)
    {
        if(file == null || file.isEmpty())
        {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }

        try {
            Path rootPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path imageDir = rootPath.resolve(subFolder);

            Files.createDirectories(imageDir);
            String originalFileName = file.getOriginalFilename();
            String extension = "";
            if(originalFileName != null && originalFileName.contains("."))
            {
                extension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            String storedFilename = UUID.randomUUID() + extension;
            Path targetPath = imageDir.resolve(storedFilename);
            file.transferTo(targetPath);

            return "/uploads/" + subFolder + "/" + storedFilename;

        }
        catch (IOException exception)
        {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }

    public void delete(String imgUrl)
    {
        if(imgUrl == null || imgUrl.isBlank())
        {
            return;
        }
        try {
            String relativePath = imgUrl.startsWith("/") ? imgUrl.substring(1) : imgUrl;
            Path rootPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = rootPath.resolve(relativePath.replaceFirst("^upload/", ""));
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new AppException(ErrorCode.FILE_UPLOAD_FAILED);
        }
    }
}