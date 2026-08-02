import React, { useEffect, useState } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import { useMyCertificate } from '../../hooks/useCertificates';
import { useActiveAcademicSessions } from '../../hooks/useAcademicSessions';
import { PageHeader } from '../../components/common/PageHeader';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Label } from '../../components/ui/label';
import { formatDate } from '../../utils/helpers';

export default function MyCertificatePage() {
  const { data: academicSessions = [] } = useActiveAcademicSessions();
  const [academicSessionId, setAcademicSessionId] = useState('');

  // Default to the only active session, or the most recent one, once loaded.
  useEffect(() => {
    if (!academicSessionId && academicSessions.length > 0) {
      setAcademicSessionId(academicSessions[0].id);
    }
  }, [academicSessions, academicSessionId]);

  const { data: certificate, isLoading } = useMyCertificate(academicSessionId);

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="My Certificate" description="View and verify your issued clearance certificate." />

      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2 max-w-xs">
            <Label className="text-xs text-muted-foreground">Academic Session</Label>
            <Select value={academicSessionId} onValueChange={setAcademicSessionId}>
              <SelectTrigger>
                <SelectValue placeholder="Select academic session" />
              </SelectTrigger>
              <SelectContent>
                {academicSessions.map(session => (
                  <SelectItem key={session.id} value={session.id}>{session.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {academicSessions.length === 0 && (
              <p className="text-xs text-muted-foreground">No active academic session is available yet.</p>
            )}
          </div>

          {!academicSessionId ? (
            <div className="text-center py-8 text-muted-foreground">
              Select an academic session above to view your certificate.
            </div>
          ) : isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading certificate...</div>
          ) : !certificate ? (
            <div className="text-center py-8 text-muted-foreground">
              No certificate has been issued yet for this academic session.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Clearance Certificate</h3>
                  <p className="text-sm text-muted-foreground">
                    Issued {certificate.issuedAt ? formatDate(certificate.issuedAt) : 'recently'}
                  </p>
                </div>
              </div>

              {(() => {
                const token = certificate.token || certificate.certificateToken;
                return (
                  <>
                    {token && (
                      <div className="rounded-md border bg-muted/40 p-3 text-sm">
                        <span className="font-medium">Verification token:</span> {token}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-3">
                      {certificate.fileUrl && (
                        <Button asChild>
                          <a href={certificate.fileUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open certificate
                          </a>
                        </Button>
                      )}
                      {token && (
                        <Button variant="outline" asChild>
                          <a href={`/verify-certificate?token=${encodeURIComponent(token)}`}>
                            Verify publicly
                          </a>
                        </Button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

