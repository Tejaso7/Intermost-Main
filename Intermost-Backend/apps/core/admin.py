from django.contrib import admin
from django.shortcuts import render, redirect
from django.contrib import messages
from django.conf import settings
import os
import signal
from .models import EnvConfig

@admin.register(EnvConfig)
class EnvConfigAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    def changelist_view(self, request, extra_context=None):
        env_path = os.path.join(settings.BASE_DIR, '.env')
        
        if request.method == 'POST':
            content = request.POST.get('content', '')
            try:
                # Write to the .env file
                with open(env_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                messages.success(request, ".env file updated successfully! Gunicorn will reload.")
                
                # Send graceful SIGHUP to Gunicorn to reload workers with new env variables
                if hasattr(signal, 'SIGHUP'):
                    try:
                        # Send SIGHUP to Gunicorn running as PID 1
                        os.kill(1, signal.SIGHUP)
                    except Exception:
                        try:
                            # Try sending SIGHUP to the parent process
                            os.kill(os.getppid(), signal.SIGHUP)
                        except Exception:
                            pass
            except Exception as e:
                messages.error(request, f"Error saving .env file: {e}")
            return redirect(request.path)

        # Read the .env file
        content = ""
        if os.path.exists(env_path):
            try:
                with open(env_path, 'r', encoding='utf-8') as f:
                    content = f.read()
            except Exception as e:
                content = f"# Error reading .env file: {e}"
        else:
            content = "# .env file does not exist. Please create one."

        context = {
            'title': 'Environment Configurator (.env)',
            'content': content,
            'opts': self.model._meta,
            'app_label': self.model._meta.app_label,
        }
        return render(request, 'admin/edit_env.html', context)
