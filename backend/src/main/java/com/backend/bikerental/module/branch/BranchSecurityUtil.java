package com.backend.bikerental.module.branch;

import com.backend.bikerental.core.exception.AppException;
import com.backend.bikerental.core.exception.ErrorCode;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

@Component
public class BranchSecurityUtil {
    public void verifyBranchAccess(String targetBranchId)
    {
        var auth = SecurityContextHolder.getContext().getAuthentication();

        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a-> a.getAuthority().equals("ROLE_admin"));

        if(isAdmin)
        {
            return;
        }

        if(auth instanceof JwtAuthenticationToken jwtAuthenticationToken)
        {
            String tokenBranchId = (String) jwtAuthenticationToken.getTokenAttributes().get("branchId");
            if(tokenBranchId == null || !tokenBranchId.equals(targetBranchId))
            {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
        else {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

    }
}
